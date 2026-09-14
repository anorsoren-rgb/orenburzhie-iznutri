import fs from "node:fs";
import path from "node:path";

let cachedCert: string | null = null;

export function getRussianTrustedRootCA(): string {
  if (cachedCert) return cachedCert;

  const certPath = path.join(
    process.cwd(),
    "certs",
    "russian_trusted_root_ca.pem"
  );

  try {
    cachedCert = fs.readFileSync(certPath, "utf-8");
    return cachedCert;
  } catch {
    console.error("[gigachat] Не удалось прочитать сертификат:", certPath);
    throw new Error(
      "Сертификат russian_trusted_root_ca.pem не найден. " +
        "Запусти: Invoke-WebRequest -Uri https://gu-st.ru/content/Other/doc/russiantrustedca.pem " +
        "-OutFile certs\\russian_trusted_root_ca.pem"
    );
  }
}
