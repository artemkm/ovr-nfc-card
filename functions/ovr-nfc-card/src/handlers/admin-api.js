const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const { buildPublicUrl, generateToken } = require('../tokens');
const { getStore } = require('../store');
const { sendJson } = require('../http');
const { generateQrSvg } = require('../qr');

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp']
]);

async function handleListMembers(req, res, config, url) {
  const { listMembers } = getStore(config);
  const result = await listMembers(config, url.searchParams.get('page'), 50);
  sendJson(res, result);
}

async function handleSearch(req, res, config, url) {
  const { searchMembers } = getStore(config);
  const results = await searchMembers(config, url.searchParams.get('q'));
  sendJson(res, { results });
}

async function handleGetMember(req, res, config, memberNumber) {
  const { getMember } = getStore(config);
  const result = await getMember(config, memberNumber);

  if (!result) {
    sendJson(res, { error: 'member_not_found' }, 404);
    return;
  }

  sendJson(res, result);
}

async function handleGenerateCard(req, res, config, memberNumber) {
  const { upsertCard } = getStore(config);
  const token = generateToken();
  const publicUrl = buildPublicUrl(config.basePublicUrl, token);
  const result = await upsertCard(config, memberNumber, {
    token,
    public_url: publicUrl,
    qr_svg: await generateQrSvg(publicUrl)
  });

  if (!result) {
    sendJson(res, { error: 'member_not_found' }, 404);
    return;
  }

  sendJson(res, result);
}

async function handleUploadMemberPhoto(req, res, config, memberNumber) {
  const { getMember, updateMemberPhoto } = getStore(config);
  const existing = await getMember(config, memberNumber);

  if (!existing) {
    sendJson(res, { error: 'member_not_found' }, 404);
    return;
  }

  const file = await readMultipartImage(req);
  if (!file) {
    sendJson(res, { error: 'photo_required' }, 400);
    return;
  }

  const extension = ALLOWED_PHOTO_TYPES.get(file.contentType);
  if (!extension) {
    sendJson(res, { error: 'unsupported_photo_type' }, 400);
    return;
  }

  if (file.buffer.length > MAX_PHOTO_SIZE) {
    sendJson(res, { error: 'photo_too_large' }, 400);
    return;
  }

  if (config.storage === 'ydb') {
    const photoUrl = `data:${file.contentType};base64,${file.buffer.toString('base64')}`;
    const result = await updateMemberPhoto(config, memberNumber, photoUrl);
    sendJson(res, result);
    return;
  }

  const relativeDir = 'member-photos';
  const filename = `${safeFilePart(memberNumber)}-${crypto.randomBytes(8).toString('hex')}.${extension}`;
  const absoluteDir = path.join(config.uploadDir, relativeDir);
  const absolutePath = path.join(absoluteDir, filename);
  const photoUrl = `/uploads/${relativeDir}/${filename}`;

  await fs.mkdir(absoluteDir, { recursive: true });
  await fs.writeFile(absolutePath, file.buffer);
  await deleteLocalPhoto(config, existing.profile.photo_url);

  const result = await updateMemberPhoto(config, memberNumber, photoUrl);
  sendJson(res, result);
}

async function handleDeleteMemberPhoto(req, res, config, memberNumber) {
  const { getMember, updateMemberPhoto } = getStore(config);
  const existing = await getMember(config, memberNumber);

  if (!existing) {
    sendJson(res, { error: 'member_not_found' }, 404);
    return;
  }

  await deleteLocalPhoto(config, existing.profile.photo_url);
  const result = await updateMemberPhoto(config, memberNumber, '');
  sendJson(res, result);
}

async function readMultipartImage(req) {
  const contentType = req.headers['content-type'] || '';
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

  if (!boundaryMatch) {
    return null;
  }

  const boundary = boundaryMatch[1] || boundaryMatch[2];
  const body = await readRawBody(req, MAX_PHOTO_SIZE + 1024 * 1024);
  const parts = body.toString('binary').split(`--${boundary}`);

  for (const part of parts) {
    if (!part.includes('name="photo"')) {
      continue;
    }

    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) {
      continue;
    }

    const rawHeaders = part.slice(0, headerEnd);
    let content = part.slice(headerEnd + 4);

    if (content.endsWith('\r\n')) {
      content = content.slice(0, -2);
    }

    const typeMatch = rawHeaders.match(/content-type:\s*([^\r\n]+)/i);
    const contentTypeHeader = typeMatch ? typeMatch[1].trim().toLowerCase() : '';

    return {
      contentType: contentTypeHeader,
      buffer: Buffer.from(content, 'binary')
    };
  }

  return null;
}

async function readRawBody(req, maxSize) {
  const chunks = [];
  let total = 0;

  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxSize) {
      throw new Error('Request body is too large');
    }
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

async function deleteLocalPhoto(config, photoUrl = '') {
  if (!photoUrl.startsWith('/uploads/member-photos/')) {
    return;
  }

  const relativePath = photoUrl.replace(/^\/uploads\//, '');
  const filePath = path.resolve(config.uploadDir, relativePath);
  const uploadRoot = path.resolve(config.uploadDir);

  if (!filePath.startsWith(`${uploadRoot}${path.sep}`)) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

function safeFilePart(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

module.exports = {
  handleGenerateCard,
  handleGetMember,
  handleDeleteMemberPhoto,
  handleListMembers,
  handleUploadMemberPhoto,
  handleSearch
};
