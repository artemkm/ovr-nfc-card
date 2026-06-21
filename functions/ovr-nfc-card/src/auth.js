const crypto = require('crypto');

const COOKIE_NAME = 'ovr_admin_session';

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function createSessionCookie(config) {
  const payload = Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64url');
  const signature = sign(payload, config.sessionSecret);
  return `${COOKIE_NAME}=${payload}.${signature}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

function isAuthenticated(req, config) {
  const cookies = parseCookies(req);
  const value = cookies[COOKIE_NAME];

  if (!value) {
    return false;
  }

  const [payload, signature] = value.split('.');
  if (!payload || !signature) {
    return false;
  }

  const actual = Buffer.from(signature);
  const expected = Buffer.from(sign(payload, config.sessionSecret));

  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function validateCredentials(config, body) {
  return body.username === config.adminUser && body.password === config.adminPassword;
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

module.exports = {
  clearSessionCookie,
  createSessionCookie,
  isAuthenticated,
  validateCredentials
};
