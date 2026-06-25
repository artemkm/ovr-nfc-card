const fs = require('fs/promises');
const path = require('path');

const { isAuthenticated } = require('./auth');
const { notFound, redirect, sendJson } = require('./http');
const { handleLogin, handleLogout } = require('./handlers/admin-auth');
const { handleAdminPage } = require('./handlers/admin-page');
const {
  handleGenerateCard,
  handleGetMember,
  handleListMembers,
  handleDeleteMemberPhoto,
  handleUploadMemberPhoto,
  handleSearch
} = require('./handlers/admin-api');
const { handlePublicCard, handlePublicContact } = require('./handlers/public-card');

async function route(req, res, config) {
  const url = new URL(req.url, config.basePublicUrl);
  const pathname = decodeURIComponent(url.pathname);

  if (req.method === 'GET' && pathname === '/') {
    redirect(res, '/admin');
    return;
  }

  if (req.method === 'GET' && pathname === '/assets/ovr-logo.png') {
    const logoPath = resolvePublicAsset('assets/ovr-logo.png');
    const logo = await fs.readFile(logoPath);
    res.writeHead(200, {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=86400'
    });
    res.end(logo);
    return;
  }

  if (req.method === 'GET' && pathname === '/assets/ovr-mark.png') {
    const logoPath = resolvePublicAsset('assets/ovr-mark.png');
    const logo = await fs.readFile(logoPath);
    res.writeHead(200, {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=86400'
    });
    res.end(logo);
    return;
  }

  if (req.method === 'GET' && pathname.startsWith('/uploads/')) {
    await serveUpload(req, res, config, pathname);
    return;
  }

  if (req.method === 'GET' && pathname === '/admin') {
    await handleAdminPage(req, res, config);
    return;
  }

  if (req.method === 'POST' && pathname === '/admin/login') {
    await handleLogin(req, res, config);
    return;
  }

  if (req.method === 'POST' && pathname === '/admin/logout') {
    await handleLogout(req, res);
    return;
  }

  if (pathname.startsWith('/admin/api/')) {
    if (!isAuthenticated(req, config)) {
      sendJson(res, { error: 'unauthorized' }, 401);
      return;
    }

    await routeAdminApi(req, res, config, url, pathname);
    return;
  }

  const publicContactMatch = pathname.match(/^\/c\/([^/]+)\/contact\.vcf$/);
  if (req.method === 'GET' && publicContactMatch) {
    await handlePublicContact(req, res, config, publicContactMatch[1]);
    return;
  }

  const publicCardMatch = pathname.match(/^\/c\/([^/]+)$/);
  if (req.method === 'GET' && publicCardMatch) {
    await handlePublicCard(req, res, config, publicCardMatch[1]);
    return;
  }

  notFound(res);
}

async function routeAdminApi(req, res, config, url, path) {
  if (req.method === 'GET' && path === '/admin/api/search') {
    await handleSearch(req, res, config, url);
    return;
  }

  if (req.method === 'GET' && path === '/admin/api/members') {
    await handleListMembers(req, res, config, url);
    return;
  }

  const getMemberMatch = path.match(/^\/admin\/api\/members\/([^/]+)$/);
  if (req.method === 'GET' && getMemberMatch) {
    await handleGetMember(req, res, config, getMemberMatch[1]);
    return;
  }

  const generateMatch = path.match(/^\/admin\/api\/members\/([^/]+)\/card\/generate$/);
  if (req.method === 'POST' && generateMatch) {
    await handleGenerateCard(req, res, config, generateMatch[1]);
    return;
  }

  const regenerateMatch = path.match(/^\/admin\/api\/members\/([^/]+)\/card\/regenerate$/);
  if (req.method === 'POST' && regenerateMatch) {
    await handleGenerateCard(req, res, config, regenerateMatch[1]);
    return;
  }

  const uploadPhotoMatch = path.match(/^\/admin\/api\/members\/([^/]+)\/photo$/);
  if (req.method === 'POST' && uploadPhotoMatch) {
    await handleUploadMemberPhoto(req, res, config, uploadPhotoMatch[1]);
    return;
  }

  if (req.method === 'DELETE' && uploadPhotoMatch) {
    await handleDeleteMemberPhoto(req, res, config, uploadPhotoMatch[1]);
    return;
  }

  notFound(res);
}

function resolvePublicAsset(relativePath) {
  return path.resolve(__dirname, '../public', relativePath);
}

async function serveUpload(req, res, config, pathname) {
  const relativePath = pathname.replace(/^\/uploads\//, '');

  if (!relativePath || relativePath.includes('..') || path.isAbsolute(relativePath)) {
    notFound(res);
    return;
  }

  const filePath = path.resolve(config.uploadDir, relativePath);
  const uploadRoot = path.resolve(config.uploadDir);

  if (!filePath.startsWith(`${uploadRoot}${path.sep}`)) {
    notFound(res);
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    res.writeHead(200, {
      'content-type': contentTypeByExtension(filePath),
      'cache-control': 'public, max-age=86400'
    });
    res.end(file);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(error);
    }
    notFound(res);
  }
}

function contentTypeByExtension(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.jpg' || extension === '.jpeg') {
    return 'image/jpeg';
  }

  if (extension === '.png') {
    return 'image/png';
  }

  if (extension === '.webp') {
    return 'image/webp';
  }

  return 'application/octet-stream';
}

module.exports = { route };
