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

## Что уже работает локально

- вход в техническую админку;
- список участников в порядке добавления в базу;
- пагинация по 50 участников на странице;
- динамический поиск;
- просмотр карточки участника;
- генерация NFC-ссылки;
- копирование готового URL;
- перегенерация NFC-ссылки с подтверждением;
- публичная страница участника по токену;
- страница "карта не найдена" для неизвестного токена;
- брендовая шапка ОВР и адаптивная верстка.

## Переменные окружения

См. `.env.example`.

При первом запуске локальная база создается из `data/sample-members.json` в `data/local-db.json`.
Файл `data/local-db.json` не коммитится и используется только для локальных проверок.

## Режимы запуска

Локальный режим:

```text
index.js -> http://localhost:3000 -> STORAGE=local -> data/local-db.json
```

Cloud Function режим:

```text
cloud.js -> handler(event) -> общий router -> хранилище по STORAGE
```

Хранилище выбирается через `STORAGE`:

```text
STORAGE=local -> src/local-store.js -> data/local-db.json
STORAGE=ydb   -> src/ydb-store.js -> YDB_ENDPOINT/YDB_DATABASE
```

Локальный режим остается режимом по умолчанию.

Для `STORAGE=ydb` нужен установленный пакет `ydb-sdk` и настроенная авторизация Yandex Cloud.

Будущий entrypoint для Yandex Cloud Function:

```text
cloud.handler
```

## GitHub

Репозиторий:

```text
git@github.com:artemkm/ovr-nfc-card.git
```

Основная ветка:

```text
main
```
