# Yandex Cloud Deployment

This document captures the current MVP deployment path.

## Resources

- Service account: `ovr-nfc-card-sa`
- Function: `ovr-nfc-card`
- API Gateway: `ovr-nfc-card-gw`
- YDB database: `ovr-nfc-card-db`

Current technical URL:

```text
https://d5dqpbmoqisug9e3u251.avjje9e3.apigw.yandexcloud.net
```

Admin URL:

```text
https://d5dqpbmoqisug9e3u251.avjje9e3.apigw.yandexcloud.net/admin
```

Cloud admin credentials are stored locally in `.env.cloud.local`. This file is
ignored by git and must not be committed.

## Function Deployment

Install dependencies locally before deploying:

```bash
cd functions/ovr-nfc-card
npm install
npm run check
```

Create a deployment directory without `node_modules`; Yandex Cloud installs
dependencies from `package-lock.json` while building the function image:

```bash
rsync -a --delete --exclude node_modules functions/ovr-nfc-card/ /tmp/ovr-nfc-card-deploy/
```

Create a new function version:

```bash
yc serverless function version create \
  --function-name ovr-nfc-card \
  --runtime nodejs22 \
  --entrypoint cloud.handler \
  --memory 256MB \
  --execution-timeout 30s \
  --service-account-id aje97i60cmrjcdn9kokn \
  --source-path /tmp/ovr-nfc-card-deploy \
  --environment STORAGE=ydb,YDB_ENDPOINT=grpcs://ydb.serverless.yandexcloud.net:2135,YDB_DATABASE=/ru-central1/b1gv7tfh65uutt1nbah0/etnjmojtve4d8pdmm44i,BASE_PUBLIC_URL=https://d5dqpbmoqisug9e3u251.avjje9e3.apigw.yandexcloud.net,ADMIN_USER=admin,ADMIN_PASSWORD=<from .env.cloud.local>,SESSION_SECRET=<from .env.cloud.local>
```

For the Yandex Cloud MVP, uploaded member photos are stored in YDB as
`data:image/...;base64,...` in `member_profiles.photo_url`. Local development
continues to store uploaded photos as files under `data/uploads/`.

## API Gateway

The gateway spec is in:

```text
infra/api-gateway/openapi.yaml
```

Create the gateway:

```bash
yc serverless api-gateway create \
  --name ovr-nfc-card-gw \
  --description "OVR NFC card MVP gateway" \
  --spec infra/api-gateway/openapi.yaml
```

## Verification

```bash
curl -i https://d5dqpbmoqisug9e3u251.avjje9e3.apigw.yandexcloud.net/admin
curl -i https://d5dqpbmoqisug9e3u251.avjje9e3.apigw.yandexcloud.net/c/not-found-demo
```

For the full flow:

1. Open `/admin`.
2. Log in with the cloud credentials.
3. Generate an NFC link for a test member.
4. Open the generated `/c/{token}` URL.
