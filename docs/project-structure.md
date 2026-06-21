# Структура проекта

## Текущая структура

```text
docs/
  mvp-plan.md
  project-structure.md
  ydb-setup.md

functions/
  ovr-nfc-card/
    package.json
    index.js
    cloud.js
    src/
      config.js
      router.js
      auth.js
      html.js
      http.js
      cloud-adapter.js
      store.js
      local-store.js
      ydb-store.js
      tokens.js
      handlers/
        public-card.js
        admin-auth.js
        admin-page.js
        admin-api.js
    public/
      assets/
        ovr-logo.png

data/
  sample-members.json
  local-db.json       локальный рабочий файл, не коммитится

infra/
  ydb/
    schema.sql
    seed.example.sql

README.md
.env.example
.gitignore
```

## Назначение папок

`docs/` хранит проектные решения, инструкции по NFC, деплою и эксплуатации MVP.

`functions/ovr-nfc-card/` содержит Node.js функцию, которая будет обслуживать публичную карточку и техническую админку.

`data/` содержит локальные тестовые данные для разработки до подключения YDB.

## Планируемая структура для Yandex Cloud

Эти файлы будут добавлены на следующем этапе, когда начнем переносить локальный прототип в облако:

```text
docs/
  nfc-process.md
  yandex-deploy.md

functions/
  ovr-nfc-card/
    src/
      ydb.js

infra/
  api-gateway/
    openapi.yaml

scripts/
  create-test-profile.js
  generate-card-url.js
  import-members.js
```
