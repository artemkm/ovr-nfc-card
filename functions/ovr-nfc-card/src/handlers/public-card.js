const { findPublicCard, touchCardScan } = require('../local-store');
const { sendHtml } = require('../http');
const { renderMessagePage, renderPublicCardPage } = require('../html');

async function handlePublicCard(req, res, config, token) {
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

module.exports = { handlePublicCard };

