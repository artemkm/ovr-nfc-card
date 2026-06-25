-- Add optional local/public profile photo URL.

ALTER TABLE member_profiles ADD COLUMN photo_url Utf8;
