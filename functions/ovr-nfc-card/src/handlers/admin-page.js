const { isAuthenticated } = require('../auth');
const { redirect, sendHtml } = require('../http');
const { renderAdminPage, renderLoginPage } = require('../html');

async function handleAdminPage(req, res, config) {
  if (!isAuthenticated(req, config)) {
    sendHtml(res, renderLoginPage());
    return;
  }

  sendHtml(res, renderAdminPage());
}

function requireAdmin(req, res, config) {
  if (isAuthenticated(req, config)) {
    return true;
  }

  redirect(res, '/admin');
  return false;
}

module.exports = {
  handleAdminPage,
  requireAdmin
};

