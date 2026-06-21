# Структура проекта

```text
docs/
  mvp-plan.md
  project-structure.md
  nfc-process.md
  yandex-deploy.md

functions/
  ovr-nfc-card/
    package.json
    index.js
    src/
      config.js
      router.js
      auth.js
      html.js
      ydb.js
      tokens.js
      handlers/
        public-card.js
        admin-auth.js
        admin-page.js
        admin-api.js

infra/
  ydb/
    schema.sql
    seed.example.sql
  api-gateway/
    openapi.yaml

scripts/
  create-test-profile.js
  generate-card-url.js
  import-members.js

data/
  sample-members.json

README.md
.env.example
```

## Назначение папок

`docs/` хранит проектные решения, инструкции по NFC, деплою и эксплуатации MVP.

`functions/ovr-nfc-card/` содержит Node.js функцию, которая будет обслуживать публичную карточку и техническую админку.

`infra/ydb/` содержит SQL-схему YDB и пример тестовых данных.

`infra/api-gateway/` содержит конфигурацию Yandex API Gateway.

`scripts/` содержит вспомогательные локальные скрипты для импорта участников, генерации тестовых записей и обслуживания MVP.

`data/` содержит локальные тестовые данные для разработки до подключения YDB.

