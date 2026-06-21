# OVR NFC Card MVP

Демонстрационный MVP NFC-карточек членов Общества врачей России.

## Локальный запуск

```bash
cd functions/ovr-nfc-card
npm run dev
```

После запуска:

```text
http://localhost:3000/admin
```

Локальный логин:

```text
admin
```

Локальный пароль:

```text
admin
```

Публичные карточки открываются по адресу:

```text
http://localhost:3000/c/{token}
```

## Переменные окружения

См. `.env.example`.

При первом запуске локальная база создается из `data/sample-members.json` в `data/local-db.json`.
Файл `data/local-db.json` не коммитится и используется только для локальных проверок.
