const {
  clearSessionCookie,
  createSessionCookie,
  validateCredentials
} = require('../auth');
const { readBody, redirect, sendHtml } = require('../http');
const { renderLoginPage } = require('../html');

async function handleLogin(req, res, config) {
  const body = await readBody(req);

  if (!validateCredentials(config, body)) {
    sendHtml(res, renderLoginPage('Неверный логин или пароль'), 401);
    return;
  }

  redirectWithCookie(res, '/admin', createSessionCookie(config));
}

async function handleLogout(req, res) {
  redirectWithCookie(res, '/admin', clearSessionCookie());
}

function redirectWithCookie(res, location, cookie) {
  res.writeHead(302, {
    location,
    'set-cookie': cookie
  });
  res.end();
}

module.exports = {
  handleLogin,
  handleLogout
};

