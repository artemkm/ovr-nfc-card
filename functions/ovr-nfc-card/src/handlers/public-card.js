const { getStore } = require('../store');
const { sendHtml } = require('../http');
const { renderMessagePage, renderPublicCardPage } = require('../html');
const { buildVCard, buildVCardFilename } = require('../vcard');

async function handlePublicCard(req, res, config, token) {
  const { findPublicCard, touchCardScan } = getStore(config);
  const result = await findPublicCard(config, token);

  if (!result || !result.card || !result.profile) {
    sendHtml(res, renderMessagePage('Карта не найдена', 'Проверьте адрес или обратитесь в ОВР.'), 404);
    return;
  }

  if (result.card.status !== 'active') {
    sendHtml(res, renderMessagePage('Карта недействительна', 'Эта NFC-карта заблокирована или перевыпущена.'), 410);
    return;
  }

  await touchCardScan(config, token);
  sendHtml(res, renderPublicCardPage(result.profile, result.card));
}

async function handlePublicContact(req, res, config, token) {
  const { findPublicCard } = getStore(config);
  const result = await findPublicCard(config, token);

  if (!result || !result.card || !result.profile) {
    sendHtml(res, renderMessagePage('Карта не найдена', 'Проверьте адрес или обратитесь в ОВР.'), 404);
    return;
  }

  if (result.card.status !== 'active') {
    sendHtml(res, renderMessagePage('Карта недействительна', 'Эта NFC-карта заблокирована или перевыпущена.'), 410);
    return;
  }

  const filename = buildVCardFilename(result.profile);
  res.writeHead(200, {
    'content-type': 'text/vcard; charset=utf-8',
    'content-disposition': `attachment; filename="${filename}"`
  });
  res.end(buildVCard(result.profile, result.card));
}

module.exports = {
  handlePublicCard,
  handlePublicContact
};
