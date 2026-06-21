# YDB Setup

This document describes the YDB part of the Yandex Cloud deployment for the OVR NFC card MVP.

## Database Type

For the demo MVP use a serverless YDB database in Yandex Cloud.

The application will need:

```text
YDB_ENDPOINT
YDB_DATABASE
STORAGE=ydb
```

`BASE_PUBLIC_URL` must be set separately to the API Gateway technical domain.

The Node.js application uses `src/ydb-store.js` when `STORAGE=ydb`. The YDB SDK package is loaded lazily, so local mode does not need it. Before deploying with YDB, install and verify the SDK:

```bash
cd functions/ovr-nfc-card
npm install ydb-sdk
```

## Tables

The schema is in:

```text
infra/ydb/schema.sql
```

It creates:

- `member_profiles`
- `member_cards`

`member_profiles` stores public profile data and a `display_order` field for the admin list order.

`member_cards` stores the active public token and generated URL. The primary key is `token`, because public NFC scans resolve by token. A secondary index on `member_number` lets the admin UI find the current card for a member.

## Apply Schema

After creating a YDB database in Yandex Cloud, apply:

```bash
ydb -e "$YDB_ENDPOINT" -d "$YDB_DATABASE" sql -f infra/ydb/schema.sql
```

For demo data:

```bash
ydb -e "$YDB_ENDPOINT" -d "$YDB_DATABASE" sql -f infra/ydb/seed.example.sql
```

The exact `YDB_ENDPOINT` and `YDB_DATABASE` values are copied from the Yandex Cloud YDB database page.

The demo seed loads member profiles only. NFC card URLs should be generated
through the admin UI after the API Gateway technical domain is known.

## MVP Query Model

Public page:

```text
GET /c/{token}
-> member_cards by token
-> member_profiles by member_number
```

Admin list:

```text
GET /admin/api/members?page=...
-> member_profiles ordered by display_order
-> member_cards lookup by member_number
```

Admin search:

```text
GET /admin/api/search?q=...
-> MVP search by search_text
```

Card generation:

```text
POST /admin/api/members/{member_number}/card/generate
-> create random token
-> write member_cards row
```

Card regeneration:

```text
POST /admin/api/members/{member_number}/card/regenerate
-> find current card by member_number
-> delete old token row
-> insert new token row
```

## Notes

- Do not store personal data on NFC tags.
- Do not use NFC UID as a secret.
- Keep `public_url` as a full ready-to-copy URL.
- For this MVP, old regenerated tokens stop working because the old `member_cards` row is deleted.
