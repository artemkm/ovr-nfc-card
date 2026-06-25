const QRCode = require('qrcode');

async function generateQrSvg(value) {
  return QRCode.toString(value, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 320,
    color: {
      dark: '#1d2429',
      light: '#ffffff'
    }
  });
}

module.exports = { generateQrSvg };
