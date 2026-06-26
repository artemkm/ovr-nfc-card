-- Switch demo member numbers to canonical OVR-0000-0000 format.
-- The physical card print number is derived in the app as 0000 0000.

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
  "OVR-0000-0001",
  1,
  "Янушевич Олег Олегович",
  "Стоматолог",
  "Ректор ФГБОУ ВО \"Российский университет медицины\" Минздрава России",
  "Москва",
  "+7 (985) 924-93-46",
  "olegyanushevich@yandex.ru",
  true,
  "ovr-0000-0001 0000 0001 янушевич олег олегович стоматолог ректор фгбоу во российский университет медицины минздрава россии москва +7 985 924 93 46 olegyanushevich@yandex.ru",
  CurrentUtcTimestamp(),
  CurrentUtcTimestamp()
),
(
  "OVR-0000-0002",
  2,
  "Петрова Анна Викторовна",
  "Невролог",
  "Врач-невролог",
  "Санкт-Петербург",
  "",
  "petrova@example.ru",
  true,
  "ovr-0000-0002 0000 0002 петрова анна викторовна невролог врач-невролог санкт-петербург",
  CurrentUtcTimestamp(),
  CurrentUtcTimestamp()
),
(
  "OVR-0000-0003",
  3,
  "Смирнов Алексей Олегович",
  "Терапевт",
  "Главный врач",
  "Казань",
  "+7 843 000-00-03",
  "",
  true,
  "ovr-0000-0003 0000 0003 смирнов алексей олегович терапевт главный врач казань",
  CurrentUtcTimestamp(),
  CurrentUtcTimestamp()
),
(
  "OVR-0000-0004",
  4,
  "Кузнецова Мария Андреевна",
  "Педиатр",
  "Врач-педиатр",
  "Екатеринбург",
  "",
  "",
  false,
  "ovr-0000-0004 0000 0004 кузнецова мария андреевна педиатр врач-педиатр екатеринбург",
  CurrentUtcTimestamp(),
  CurrentUtcTimestamp()
);

UPDATE member_cards
SET member_number = "OVR-0000-0001"
WHERE member_number = "10001";

UPDATE member_cards
SET member_number = "OVR-0000-0002"
WHERE member_number = "10002";

UPDATE member_cards
SET member_number = "OVR-0000-0003"
WHERE member_number = "10003";

UPDATE member_cards
SET member_number = "OVR-0000-0004"
WHERE member_number = "10004";

DELETE FROM member_profiles
WHERE member_number = "10001";

DELETE FROM member_profiles
WHERE member_number = "10002";

DELETE FROM member_profiles
WHERE member_number = "10003";

DELETE FROM member_profiles
WHERE member_number = "10004";
