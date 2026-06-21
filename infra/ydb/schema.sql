-- YDB schema for the OVR NFC card MVP.
--
-- The MVP keeps one current NFC card per member. Public card lookup is by
-- token, so member_cards uses token as the primary key and has a secondary
-- index for member_number.

CREATE TABLE IF NOT EXISTS member_profiles (
  member_number Utf8 NOT NULL,
  display_order Uint64,
  full_name Utf8,
  specialty Utf8,
  position Utf8,
  city Utf8,
  public_phone Utf8,
  public_email Utf8,
  is_active_member Bool,
  search_text Utf8,
  created_at Timestamp,
  updated_at Timestamp,
  INDEX display_order_idx GLOBAL ON (display_order),
  INDEX full_name_idx GLOBAL ON (full_name),
  PRIMARY KEY (member_number)
);

CREATE TABLE IF NOT EXISTS member_cards (
  token Utf8 NOT NULL,
  member_number Utf8 NOT NULL,
  public_url Utf8,
  status Utf8,
  nfc_uid Utf8,
  created_at Timestamp,
  updated_at Timestamp,
  last_seen_at Timestamp,
  scan_count Uint64,
  INDEX member_number_idx GLOBAL ON (member_number),
  INDEX status_idx GLOBAL ON (status),
  PRIMARY KEY (token)
);
