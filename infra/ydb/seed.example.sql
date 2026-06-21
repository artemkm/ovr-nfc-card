-- Example seed data for a demo YDB database.
-- Replace values before using in a real demonstration.

UPSERT INTO member_profiles (
  member_number,
  display_order,
  full_name,
  specialty,
  position,
  city,
  public_phone,
  public_email,
  is_active_member,
  search_text,
  created_at,
  updated_at
) VALUES
(
  "10001",
  1,
  "Иванов Иван Сергеевич",
  "Кардиолог",
  "Заведующий кардиологическим отделением",
  "Москва",
  "+7 495 000-00-01",
  "ivanov@example.ru",
  true,
  "10001 иванов иван сергеевич кардиолог заведующий кардиологическим отделением москва",
  CurrentUtcTimestamp(),
  CurrentUtcTimestamp()
),
(
  "10002",
  2,
  "Петрова Анна Викторовна",
  "Невролог",
  "Врач-невролог",
  "Санкт-Петербург",
  "",
  "petrova@example.ru",
  true,
  "10002 петрова анна викторовна невролог врач-невролог санкт-петербург",
  CurrentUtcTimestamp(),
  CurrentUtcTimestamp()
);

UPSERT INTO member_cards (
  token,
  member_number,
  public_url,
  status,
  nfc_uid,
  created_at,
  updated_at,
  last_seen_at,
  scan_count
) VALUES (
  "demo-card-ivanov-10001",
  "10001",
  "https://<gateway-id>.apigw.yandexcloud.net/c/demo-card-ivanov-10001",
  "active",
  "",
  CurrentUtcTimestamp(),
  CurrentUtcTimestamp(),
  NULL,
  0
);

