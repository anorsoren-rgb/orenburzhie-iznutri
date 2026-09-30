SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Va4qWYNzrv2i7KqLb3XLFiy3AcAPk7YIkyfayFnYMt2eRXLeyZ4h2xdfIT05Ixe

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."custom_oauth_providers" ("id", "provider_type", "identifier", "name", "client_id", "client_secret", "acceptable_client_ids", "scopes", "pkce_enabled", "attribute_mapping", "authorization_params", "enabled", "email_optional", "issuer", "discovery_url", "skip_nonce_check", "cached_discovery", "discovery_cached_at", "authorization_url", "token_url", "userinfo_url", "jwks_uri", "created_at", "updated_at", "custom_claims_allowlist") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	59c6ae61-f2f2-4087-b976-69ff0a89e775	authenticated	authenticated	anorsoren@gmail.com	$2a$10$h1JHtIMmMeZ.JF1VjSj6.OxWP4l9XrMlQlFSAEqcO7X1Hkfeyoboq	2026-09-14 08:45:31.395043+00	\N		\N		\N			\N	2026-09-14 08:45:31.401795+00	{"provider": "email", "providers": ["email"]}	{"sub": "59c6ae61-f2f2-4087-b976-69ff0a89e775", "email": "anorsoren@gmail.com", "username": "Admin", "full_name": "Admin", "email_verified": true, "phone_verified": false}	\N	2026-09-14 08:45:31.363412+00	2026-09-14 09:44:18.299888+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	authenticated	authenticated	test1@gmail.com	$2a$10$y8xZD6hDkWtPBJG01RxgveBozNwED67H9EUaOsxRugYfSlhx0a.pm	2026-09-13 14:29:22.319994+00	\N		\N		\N			\N	2026-09-13 16:51:10.339874+00	{"provider": "email", "providers": ["email"]}	{"sub": "c46d8ddd-d35c-4e55-95a3-4deff2bf6ece", "email": "test1@gmail.com", "username": "Иван Петров", "full_name": "Иван Петров", "email_verified": true, "phone_verified": false}	\N	2026-09-13 14:29:22.293804+00	2026-09-14 08:06:51.244638+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	{"sub": "c46d8ddd-d35c-4e55-95a3-4deff2bf6ece", "email": "test1@gmail.com", "username": "Иван Петров", "full_name": "Иван Петров", "email_verified": false, "phone_verified": false}	email	2026-09-13 14:29:22.31468+00	2026-09-13 14:29:22.31474+00	2026-09-13 14:29:22.31474+00	ddcbcf87-1c66-4947-90e5-6e618b21565e
59c6ae61-f2f2-4087-b976-69ff0a89e775	59c6ae61-f2f2-4087-b976-69ff0a89e775	{"sub": "59c6ae61-f2f2-4087-b976-69ff0a89e775", "email": "anorsoren@gmail.com", "username": "Admin", "full_name": "Admin", "email_verified": false, "phone_verified": false}	email	2026-09-14 08:45:31.389884+00	2026-09-14 08:45:31.389977+00	2026-09-14 08:45:31.389977+00	069a8e0e-f7da-446d-ace8-e30fb65f7e8e
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
0831b40d-e862-421d-9331-958179aff398	59c6ae61-f2f2-4087-b976-69ff0a89e775	2026-09-14 08:45:31.403684+00	2026-09-14 09:44:18.31522+00	\N	aal1	\N	2026-09-14 09:44:18.315073	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 YaBrowser/26.8.0.0 Safari/537.36	46.191.188.99	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
0831b40d-e862-421d-9331-958179aff398	2026-09-14 08:45:31.419231+00	2026-09-14 08:45:31.419231+00	password	dc9e67f3-5926-4749-9902-06b61e19dd36
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: mfa_recovery_code_sets; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_recovery_code_sets" ("id", "user_id", "mfa_factor_id", "failed_verification_count", "verification_locked_until", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: mfa_recovery_codes; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_recovery_codes" ("id", "mfa_recovery_code_set_id", "code_hash", "consumed_at", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at", "expires_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	7	hfmumbrgt7nq	59c6ae61-f2f2-4087-b976-69ff0a89e775	t	2026-09-14 08:45:31.40849+00	2026-09-14 09:44:18.279795+00	\N	0831b40d-e862-421d-9331-958179aff398
00000000-0000-0000-0000-000000000000	8	xkb3h7taugan	59c6ae61-f2f2-4087-b976-69ff0a89e775	f	2026-09-14 09:44:18.292148+00	2026-09-14 09:44:18.292148+00	hfmumbrgt7nq	0831b40d-e862-421d-9331-958179aff398
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: scim_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."scim_tokens" ("id", "sso_provider_id", "token_hash", "prefix", "created_at", "expires_at", "revoked_at", "last_used_at") FROM stdin;
\.


--
-- Data for Name: scim_users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."scim_users" ("id", "sso_provider_id", "user_id", "resource", "created_at", "updated_at", "deleted_at") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_challenges" ("id", "user_id", "challenge_type", "session_data", "created_at", "expires_at") FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_credentials" ("id", "user_id", "credential_id", "public_key", "attestation_type", "aaguid", "sign_count", "transports", "backup_eligible", "backed_up", "friendly_name", "created_at", "updated_at", "last_used_at") FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."categories" ("id", "slug", "name", "icon", "sort_order") FROM stdin;
1	priroda	Природа	🌲	10
2	istoriya	История	🏛️	20
3	legendy	Легенды	📖	30
4	arhitektura	Архитектура	🏰	40
5	muzei	Музеи	🎨	50
6	zabroshki	Заброшки	🏚️	60
7	eda	Еда и кафе	🍽️	70
8	detyam	С детьми	🎠	80
9	foto	Фотоместа	📸	90
10	sobytiya	События	🎉	100
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."profiles" ("id", "username", "full_name", "avatar_url", "bio", "role", "reputation", "created_at", "updated_at", "terms_accepted_at", "privacy_accepted_at", "marketing_consent", "consent_version") FROM stdin;
c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	Иван Петров	Иван Петров		\N	user	0	2026-09-13 14:29:22.292701+00	2026-09-13 14:29:22.292701+00	\N	\N	f	\N
59c6ae61-f2f2-4087-b976-69ff0a89e775	Admin	Admin		\N	admin	0	2026-09-14 08:45:31.360796+00	2026-09-14 08:49:29.762734+00	\N	\N	f	\N
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."comments" ("id", "target_type", "target_id", "user_id", "body", "status", "created_at") FROM stdin;
\.


--
-- Data for Name: donations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."donations" ("id", "user_id", "amount_rub", "provider", "provider_payment_id", "status", "created_at") FROM stdin;
\.


--
-- Data for Name: places; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."places" ("id", "slug", "title", "short_desc", "full_desc", "cover_url", "gallery", "lat", "lng", "category_id", "author_id", "status", "season", "is_free", "how_to_get", "tips", "warnings", "views", "created_at", "updated_at", "created_by_gigachat") FROM stdin;
3171118a-149c-4825-8e3e-a6865a928e49	iriklinskoe-vodohranilishche	Ириклинское водохранилище	Одно из крупнейших водохранилищ Урала. Рыбалка, кайтсёрфинг, песчаные пляжи и закаты, которые невозможно забыть.	Ириклинское водохранилище — крупнейший водоём Оренбургской области, расположенный в 80 км от Орска. Протяжённость — более 70 километров. Здесь водится судак, лещ, сом и щука. Летом работает несколько баз отдыха, можно арендовать лодку или заняться кайтсёрфингом. На закате вода становится розово-золотой — это зрелище стоит увидеть хотя бы раз.	\N	[]	51.75	58.5	1	\N	published	summer	t	\N	\N	\N	0	2026-09-13 15:07:24.462907+00	2026-09-13 17:09:34.891923+00	f
a3337531-253f-4c06-908e-776ae18eb79e	orskaia-krepost	Орская крепость	Историческое место основания города. Сохранились валы, рядом — краеведческий музей и старинные улицы.	Орская крепость была основана в 1735 году как часть Оренбургской экспедиции. Сегодня на её месте — исторический центр Орска с сохранившимися валами и реконструированными элементами. Рядом находится краеведческий музей, где можно узнать об истории города с XVIII века. Отличное место для прогулок по старым улицам и знакомства с историей Оренбуржья.	\N	[]	51.2	58.55	2	\N	published	all	f	\N	\N	\N	0	2026-09-13 15:07:24.462907+00	2026-09-13 17:09:34.891923+00	f
045a0a22-299b-445a-a8c6-59d2b5f32ce7	gora-polkovnik-e36896	Гора Полковник	Гора Полковник — живописное место с красивой панорамой и легендой о лагере Емельяна Пугачёва.	Гора Полковник находится недалеко от города Бузулук. С вершины открывается потрясающий вид на окрестности, особенно красив закат. По преданию, именно здесь располагался лагерь знаменитого Емельяна Пугачёва. Сегодняшний пейзаж хранит дух тех событий и привлекает туристов любоваться закатом и историей региона.	\N	[]	\N	\N	3	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	published	all	t	Добраться до горы Полковник можно автомобилем примерно за час из Бузулука. Проезжайте по трассе Бузулук — Переволоцк, затем следуйте указателям. Ориентир — село Чкалово. Место популярное среди местных жителей, поэтому проблем с парковкой обычно нет.	🛣️ Возьмите с собой воду и перекус.\n🌅 Идеальное время для посещения — вечерние часы летом, когда солнце окрашивает горизонт в яркие краски.\n👗 Оденьтесь удобно и захватите тёплую одежду, даже летом вечером бывает прохладно.\n📚 Узнайте больше о восстании Пугачёва перед поездкой, чтобы лучше понять атмосферу места.		5	2026-09-13 17:01:21.04169+00	2026-09-14 10:12:49.779872+00	t
69a39d01-3518-4b56-997b-65ef6fc3e3b4	тестовое-место-для-модерации-mu10cgan	Тестовое место для модерации	Умиротворённый уголок природы с красивой природой и богатой историей.	Тестовое место скрывает тихие леса и живописные холмы, где переплетаются древние легенды и современные прогулки. Здесь легко забыть о суете большого города и насладиться покоем и тишиной. Местные жители рассказывают истории об удивительных явлениях, происходивших здесь веками.	\N	[]	\N	\N	1	59c6ae61-f2f2-4087-b976-69ff0a89e775	published	all	t	Добраться сюда из Орска несложно: двигайтесь по трассе на юг около часа. Ориентиром служит деревня Малый Бугор, затем следуйте указателям. Есть парковка у входа.	🛣️ Возьмите с собой термос с чаем или водой.\n🏔️ Оденьтесь удобно, учитывая погоду.\n📚 Узнайте местные легенды заранее — они добавляют особый шарм прогулкам.\n👨‍👩‍👧 Семейные группы оценят спокойную атмосферу для отдыха.		0	2026-09-14 08:55:30.098114+00	2026-09-14 08:57:21.498617+00	f
c22c4422-0e7e-4193-8433-3308c42e6866	guberlinskie-gory	Губерлинские горы	Живописные холмы и скалы в 60 км от Орска. Идеально для выходных: пешие прогулки, фотографии, палаточный лагерь.	Губерлинские горы — это живописный горный массив в Оренбургской области, расположенный в 60 км к востоку от Орска. Здесь можно увидеть причудливые скальные останцы, глубокие ущелья и бескрайние степи. Горы особенно красивы весной, когда степь покрывается тюльпанами, и осенью, когда травы становятся золотисто-багровыми. Это популярное место для пеших походов и фотосессий.	https://uhjvbqveuygsihbyuibp.supabase.co/storage/v1/object/public/places/c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362679113-mi6yia.webp	["https://uhjvbqveuygsihbyuibp.supabase.co/storage/v1/object/public/places/c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362679113-mi6yia.webp", "https://uhjvbqveuygsihbyuibp.supabase.co/storage/v1/object/public/places/c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362696517-4d1q44.webp", "https://uhjvbqveuygsihbyuibp.supabase.co/storage/v1/object/public/places/c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362697734-ma0c33.webp", "https://uhjvbqveuygsihbyuibp.supabase.co/storage/v1/object/public/places/c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362698846-qdfhin.webp", "https://uhjvbqveuygsihbyuibp.supabase.co/storage/v1/object/public/places/c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362699627-6nsqb7.webp"]	51.2167	58.9833	1	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	published	all	t				12	2026-09-13 15:07:24.462907+00	2026-09-14 09:19:40.85029+00	f
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."events" ("id", "slug", "title", "description", "starts_at", "ends_at", "place_id", "address", "price_rub", "url", "cover_url", "status", "created_at") FROM stdin;
fd601664-56d6-449b-94f8-5121edf402bb	den-goroda-orska-2026	День города Орска	Ежегодный праздник, посвящённый основанию города. Концерты, ярмарки, фейерверк и народные гуляния на Центральной площади. Выступают местные коллективы и приглашённые артисты.	2026-09-28 17:51:24.264918+00	2026-09-29 17:51:24.264918+00	\N	Центральная площадь, Орск	0	\N	\N	published	2026-09-13 17:51:24.264918+00
77995b3f-b519-479d-acdb-c2365cfa5811	festival-stepnoy-veter	Фестиваль «Степной ветер»	Музыкальный фестиваль под открытым небом в Губерлинских горах. Фолк, рок, этно-музыка. Палаточный лагерь, костёр, звёздное небо. Вход по билетам, дети до 10 лет — бесплатно.	2026-10-23 17:51:24.264918+00	2026-10-25 17:51:24.264918+00	\N	Губерлинские горы, Оренбургская область	1500	https://example.com/stepnoy-veter	\N	published	2026-09-13 17:51:24.264918+00
66058b53-e91c-4bb6-bdf2-0c7affc62544	ekskursiya-po-orsku	Экскурсия «Орск купеческий»	Двухчасовая пешеходная экскурсия по историческому центру Орска. Старинные купеческие дома, Орская крепость, легенды и истории старожилов. Сбор группы у краеведческого музея.	2026-09-18 17:51:24.264918+00	2026-09-18 19:51:24.264918+00	\N	Краеведческий музей, Орск	500	\N	\N	published	2026-09-13 17:51:24.264918+00
\.


--
-- Data for Name: gigachat_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."gigachat_logs" ("id", "user_id", "scenario", "prompt", "response", "prompt_tokens", "response_tokens", "duration_ms", "error", "created_at") FROM stdin;
\.


--
-- Data for Name: legends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."legends" ("id", "slug", "title", "excerpt", "body", "place_id", "author_id", "source", "status", "views", "created_at", "updated_at") FROM stdin;
a410e82a-1c96-4350-b4d7-48adafe1753c	legenda-o-urale-batyre	Легенда о Урал-батыре	Как древний батыр разделил мир на Европу и Азию и отдал жизнь за людей.	В давние времена жил на свете могучий батыр по имени Урал. Он был сильнее всех людей и зверей, и не было ему равных. Однажды узнал Урал, что люди умирают от жажды — не было в степях рек, только сухая трава и палящее солнце.\r\n\r\nУрал решил спасти свой народ. Он собрал всех зверей и птиц и отправился на поиски воды. Долго шли они, пока не нашли глубокое подземное море. Но море было закрыто камнями, и никто не мог их сдвинуть.\r\n\r\nТогда Урал-батыр сам взялся за дело. Он сдвинул камни и выпустил воду. Вода хлынула наружу и потекла по степи, превращаясь в широкую реку. Так появилась река Урал — разделяющая Европу и Азию.\r\n\r\nНо Урал потратил всю свою силу. Он упал на землю и превратился в горы — Уральские. А река, которую он выпустил, течёт и поныне, поя людей и зверей.\r\n\r\nТак гласит башкирская легенда, которую рассказывают и в Оренбуржье.	\N	\N	Башкирский эпос, народное предание	published	0	2026-09-13 17:42:28.208042+00	2026-09-13 17:42:28.208042+00
4c557501-41f0-41f2-9ffd-19b700fb9e92	taina-orskoi-kreposti	Тайна Орской крепости	Подземные ходы, клады и призраки — что рассказывают старожилы о первых годах Орска.	Когда в 1735 году на берегу реки Орь заложили Орскую крепость, место выбрали не случайно. Старики говорили: здесь проходит «земляная жила» — невидимая сила, охраняющая город от врагов.\r\n\r\nРассказывают, что под крепостью есть подземные ходы, ведущие к реке и к соседним холмам. По ним казаки могли незаметно уходить из осаждённой крепости и приводить подмогу. Часть ходов сохранилась до сих пор, но входы завалены и забыты.\r\n\r\nЕщё одна история — про клад. Будто бы один из первых атаманов спрятал в подземелье серебро и золото, привезённое из дальних походов. Клад до сих пор не найден, но иногда местные жители находят старинные монеты на берегу Ори.\r\n\r\nА по ночам, говорят, у стен крепости можно увидеть фигуру казака в старинной одежде — он ходит вдоль валов и охраняет покой города, как делал это двести лет назад.	\N	\N	Записи орских краеведов XIX–XX вв.	published	0	2026-09-13 17:42:28.208042+00	2026-09-13 17:42:28.208042+00
dfbade0b-d265-4a2a-95cd-9457a3e4e642	gde-zhivet-echo	Где живёт эхо	Легенды Губерлинских гор: почему в ущельях слышны голоса и кто их на самом деле издаёт.	Губерлинские горы издавна считаются местом необычным. Путники, зашедшие в ущелья, рассказывали, что слышат голоса — чьи-то шёпоты, зов, иногда плач. И эхо здесь особенное: оно не повторяет слова, а отвечает так, будто говорит кто-то живой.\r\n\r\nСтарики объясняли это так: в горах живут духи ветра. Они не злые, но не любят, когда их тревожат. Если человек заходит в ущелье с добрым сердцем — духи помогают ему найти дорогу. Если со злым — заводят в тупик.\r\n\r\nЕсть и другое предание. Когда-то в этих горах скрывались беглые люди — от царской власти, от войн, от долгов. Они жили в пещерах и перекликались друг с другом особым свистом, чтобы не выдать себя. Их давно нет, а свист остался — его повторяют скалы.\r\n\r\nУчёные говорят, что дело в ветре и форме ущелий — звук отражается и создаёт «голоса». Но местные всё равно верят: эхо в Губерлинских горах живое.	\N	\N	Записи этнографических экспедиций Оренбургского края	published	0	2026-09-13 17:42:28.208042+00	2026-09-13 17:42:28.208042+00
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tags" ("id", "slug", "name") FROM stdin;
\.


--
-- Data for Name: place_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."place_tags" ("place_id", "tag_id") FROM stdin;
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."quizzes" ("id", "slug", "title", "description", "place_id", "questions", "created_by_gigachat", "status", "created_at") FROM stdin;
ed968387-9790-4444-b9bb-684f11fb563b	viktorina-o-guberlinskih-gorah-7oc4zj	Викторина о Губерлинских горах	Тест по месту «Губерлинские горы»	c22c4422-0e7e-4193-8433-3308c42e6866	[{"q": "Где именно находятся Губерлинские горы?", "correct": 1, "explain": "Губерлинские горы расположены на востоке Оренбургской области.", "options": ["На западе Оренбургской области", "На востоке Оренбургской области", "На севере Челябинской области", "На юге Саратовской области"]}, {"q": "Как далеко Губерлинские горы от города Орска?", "correct": 2, "explain": "Губерлинские горы находятся примерно в 60 километрах от Орска.", "options": ["20 км", "40 км", "60 км", "80 км"]}, {"q": "Чем знамениты Губерлинские горы в весенний период?", "correct": 0, "explain": "Весной Губерлинские горы славятся цветением тюльпанов.", "options": ["Цветением тюльпанов", "Посевами пшеницы", "Лавированием бабочек", "Разнообразием грибов"]}, {"q": "Какой природный ландшафт характерен для Губерлинских гор?", "correct": 2, "explain": "Губерлинские горы имеют горный рельеф.", "options": ["Лесной", "Степной", "Горный тайга", "Полупустынный"]}, {"q": "Какие активности популярны среди туристов в Губерлинских горах?", "correct": 3, "explain": "Среди популярных активностей — пешие прогулки и фотосессии.", "options": ["Рыбалка", "Катание на лыжах", "Пешие прогулки и фотосессии", "Подводное плавание"]}]	t	published	2026-09-14 03:54:20.5718+00
\.


--
-- Data for Name: quiz_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."quiz_results" ("id", "quiz_id", "user_id", "score", "total", "answers", "created_at") FROM stdin;
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."reports" ("id", "target_type", "target_id", "user_id", "reason", "comment", "status", "created_at") FROM stdin;
\.


--
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."routes" ("id", "slug", "title", "description", "duration_min", "budget_rub", "transport", "author_id", "status", "gpx_url", "pdf_url", "views", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: route_places; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."route_places" ("route_id", "place_id", "order_index") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type", "versioning_status", "lifecycle_configuration", "lifecycle_configuration_generation") FROM stdin;
places	places	\N	2026-09-13 14:10:46.813163+00	2026-09-13 14:10:46.813163+00	t	f	\N	\N	\N	STANDARD	DISABLED	\N	\N
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "archived_at", "is_delete_marker", "is_versioned") FROM stdin;
707649de-5756-4c8d-ae25-d3ea6e4fb4b5	places	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362679113-mi6yia.webp	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	2026-09-14 05:11:21.396071+00	2026-09-14 05:11:21.396071+00	2026-09-14 05:11:21.396071+00	{"eTag": "\\"54d2cc377cb96489c3f947672f3f6253\\"", "size": 107128, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-09-14T05:11:22.000Z", "contentLength": 107128, "httpStatusCode": 200}	06f86a85-a9e6-4fd5-a657-ba268e4be0ec	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	{}	\N	f	f
651339a2-1721-4074-a2c6-1e60283a6b7b	places	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362696517-4d1q44.webp	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	2026-09-14 05:11:38.404748+00	2026-09-14 05:11:38.404748+00	2026-09-14 05:11:38.404748+00	{"eTag": "\\"d0b5b28b287c2e56c51e1d1e074ecebe\\"", "size": 56150, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-09-14T05:11:39.000Z", "contentLength": 56150, "httpStatusCode": 200}	c429e15a-7543-4b6e-9452-f4dd8f0233cc	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	{}	\N	f	f
3c61648c-d242-4f97-b800-29cd43725154	places	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362697734-ma0c33.webp	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	2026-09-14 05:11:39.614214+00	2026-09-14 05:11:39.614214+00	2026-09-14 05:11:39.614214+00	{"eTag": "\\"912bcd2ced2f046bc9fe38d8fb616605\\"", "size": 83866, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-09-14T05:11:40.000Z", "contentLength": 83866, "httpStatusCode": 200}	3ba4bfe6-de78-4cfe-bf61-3ff344b9464e	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	{}	\N	f	f
1680dfd5-61fa-49d8-8bde-868d204d48e0	places	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362698846-qdfhin.webp	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	2026-09-14 05:11:40.735473+00	2026-09-14 05:11:40.735473+00	2026-09-14 05:11:40.735473+00	{"eTag": "\\"3641805b1822088274ecff6044bb013c\\"", "size": 73536, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-09-14T05:11:41.000Z", "contentLength": 73536, "httpStatusCode": 200}	44b11184-1b86-4bfd-811f-b00514429560	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	{}	\N	f	f
5367d19e-7e59-4e3f-98b7-6342b3cb0974	places	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece/1789362699627-6nsqb7.webp	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	2026-09-14 05:11:41.529054+00	2026-09-14 05:11:41.529054+00	2026-09-14 05:11:41.529054+00	{"eTag": "\\"15fe1348149513592d26a962479d1660\\"", "size": 77304, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-09-14T05:11:42.000Z", "contentLength": 77304, "httpStatusCode": 200}	09f29d3d-a5eb-49a5-8d62-5920dacab4e9	c46d8ddd-d35c-4e55-95a3-4deff2bf6ece	{}	\N	f	f
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata", "metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 8, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 10, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tags_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict Va4qWYNzrv2i7KqLb3XLFiy3AcAPk7YIkyfayFnYMt2eRXLeyZ4h2xdfIT05Ixe

RESET ALL;
