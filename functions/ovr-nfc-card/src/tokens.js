const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(24).toString('base64url');
}

function buildPublicUrl(basePublicUrl, token) {
  return `${basePublicUrl.replace(/\/$/, '')}/c/${token}`;
}

module.exports = { buildPublicUrl, generateToken };

