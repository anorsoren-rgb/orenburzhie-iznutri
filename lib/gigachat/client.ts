import { Agent, fetch as undiciFetch } from "undici";
import { getRussianTrustedRootCA } from "./cert";

// ============================================
// ТИПЫ
// ============================================
type GigaChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type GigaChatRequest = {
  model?: string;
  messages: GigaChatMessage[];
  temperature?: number;
  max_tokens?: number;
};

export type GigaChatResponse = {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// ============================================
// КЭШ ТОКЕНА
// ============================================
let tokenCache: { value: string; expiresAt: number } | null = null;

// ============================================
// HTTP-АГЕНТ С СЕРТИФИКАТОМ МИНЦИФРЫ
// ============================================
const httpsAgent = new Agent({
  connect: {
    ca: getRussianTrustedRootCA(),
  },
});

// ============================================
// ПОЛУЧЕНИЕ ТОКЕНА
// ============================================
async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.value;
  }

  const authKey = process.env.GIGACHAT_AUTH_KEY;
  const scope = process.env.GIGACHAT_SCOPE ?? "GIGACHAT_API_PERS";
  const oauthUrl =
    process.env.GIGACHAT_OAUTH_URL ??
    "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";

  if (!authKey) {
    throw new Error("GIGACHAT_AUTH_KEY не задан в .env.local");
  }

  const res = await undiciFetch(oauthUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      RqUID: crypto.randomUUID(),
      Authorization: `Basic ${authKey}`,
    },
    body: new URLSearchParams({ scope }).toString(),
    dispatcher: httpsAgent,
  } as any);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GigaChat OAuth ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_at: number;
  };

  tokenCache = {
    value: data.access_token,
    expiresAt: data.expires_at,
  };

  return data.access_token;
}

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ ЧАТА
// ============================================
export async function gigachatChat(
  req: GigaChatRequest
): Promise<GigaChatResponse> {
  const token = await getAccessToken();
  const apiUrl =
    process.env.GIGACHAT_API_URL ?? "https://api.giga.chat/v1";
  const model = req.model ?? process.env.GIGACHAT_MODEL ?? "GigaChat";

  const res = await undiciFetch(`${apiUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model,
      messages: req.messages,
      temperature: req.temperature ?? 0.7,
      max_tokens: req.max_tokens ?? 1024,
    }),
    dispatcher: httpsAgent,
  } as any);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GigaChat API ${res.status}: ${text}`);
  }

  return (await res.json()) as GigaChatResponse;
}

// ============================================
// УДОБНАЯ ОБЁРТКА: один вопрос — один ответ
// ============================================
export async function askGigaChat(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const res = await gigachatChat({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return res.choices[0]?.message?.content ?? "";
}

// ============================================
// ЗАПРОС С ОЖИДАНИЕМ JSON
// ============================================
export async function askGigaChatJSON<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const text = await askGigaChat(
    systemPrompt + "\n\nОтвечай ТОЛЬКО валидным JSON без markdown-обёрток.",
    userPrompt
  );

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    throw new Error(
      `GigaChat вернул не-JSON. Сырой ответ: ${text.slice(0, 500)}`
    );
  }
}
