const { buildPublicUrl, generateToken } = require('../tokens');
const { getStore } = require('../store');
const { sendJson } = require('../http');

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
  const result = await upsertCard(config, memberNumber, {
    token,
    public_url: buildPublicUrl(config.basePublicUrl, token)
  });

  if (!result) {
    sendJson(res, { error: 'member_not_found' }, 404);
    return;
  }

  sendJson(res, result);
}

module.exports = {
  handleGenerateCard,
  handleGetMember,
  handleListMembers,
  handleSearch
};
