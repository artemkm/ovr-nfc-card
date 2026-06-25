-- Add scientific profile fields and QR storage for generated NFC cards.
-- Apply this DDL migration before loading infra/ydb/seed.example.sql.

ALTER TABLE member_profiles ADD COLUMN scientific_title Utf8;
ALTER TABLE member_profiles ADD COLUMN academic_degree Utf8;
ALTER TABLE member_cards ADD COLUMN qr_svg Utf8;
