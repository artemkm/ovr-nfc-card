-- Example seed data for a demo YDB database.
-- It loads demo member profiles only. NFC cards should be generated through
-- the admin UI after BASE_PUBLIC_URL is known.

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
),
(
  "10003",
  3,
  "Смирнов Алексей Олегович",
  "Терапевт",
  "Главный врач",
  "Казань",
  "+7 843 000-00-03",
  "",
  true,
  "10003 смирнов алексей олегович терапевт главный врач казань",
  CurrentUtcTimestamp(),
  CurrentUtcTimestamp()
),
(
  "10004",
  4,
  "Кузнецова Мария Андреевна",
  "Педиатр",
  "Врач-педиатр",
  "Екатеринбург",
  "",
  "",
  false,
  "10004 кузнецова мария андреевна педиатр врач-педиатр екатеринбург",
  CurrentUtcTimestamp(),
  CurrentUtcTimestamp()
);
