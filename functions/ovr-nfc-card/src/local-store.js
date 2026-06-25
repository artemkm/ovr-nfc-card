const fs = require('fs/promises');
const { formatCardPrintNumber } = require('./member-numbers');

const ACTIVE_STATUSES = new Set(['active']);
const DEFAULT_PAGE_SIZE = 50;

async function readData(config) {
  await ensureDataFile(config);
  const raw = await fs.readFile(config.dataFile, 'utf8');
  return JSON.parse(raw);
}

async function writeData(config, data) {
  await fs.writeFile(config.dataFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function ensureDataFile(config) {
  try {
    await fs.access(config.dataFile);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    const seed = await fs.readFile(config.seedFile, 'utf8');
    await fs.writeFile(config.dataFile, seed, 'utf8');
  }
}

async function searchMembers(config, query) {
  const data = await readData(config);
  const needle = String(query || '').trim().toLowerCase();

  if (!needle) {
    return [];
  }

  return data.profiles
    .filter((profile) => {
      const haystack = [
        profile.member_number,
        formatCardPrintNumber(profile.member_number),
        profile.full_name,
        profile.specialty,
        profile.position,
        profile.city
      ].join(' ').toLowerCase();

      return haystack.includes(needle);
    })
    .slice(0, 20)
    .map((profile) => toMemberListItem(data, profile));
}

async function listMembers(config, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const data = await readData(config);
  const normalizedPage = Math.max(1, Number(page) || 1);
  const normalizedPageSize = Math.max(1, Math.min(100, Number(pageSize) || DEFAULT_PAGE_SIZE));
  const total = data.profiles.length;
  const totalPages = Math.max(1, Math.ceil(total / normalizedPageSize));
  const safePage = Math.min(normalizedPage, totalPages);
  const start = (safePage - 1) * normalizedPageSize;

  return {
    page: safePage,
    page_size: normalizedPageSize,
    total,
    total_pages: totalPages,
    results: data.profiles
      .slice(start, start + normalizedPageSize)
      .map((profile) => toMemberListItem(data, profile))
  };
}

async function getMember(config, memberNumber) {
  const data = await readData(config);
  const profile = data.profiles.find((item) => item.member_number === memberNumber);

  if (!profile) {
    return null;
  }

  return {
    profile,
    card: findCardByMemberNumber(data, memberNumber)
  };
}

async function findPublicCard(config, token) {
  const data = await readData(config);
  const card = data.cards.find((item) => item.token === token);

  if (!card) {
    return null;
  }

  const profile = data.profiles.find((item) => item.member_number === card.member_number);
  return { profile, card };
}

async function touchCardScan(config, token) {
  const data = await readData(config);
  const card = data.cards.find((item) => item.token === token);

  if (!card) {
    return null;
  }

  card.scan_count = Number(card.scan_count || 0) + 1;
  card.last_seen_at = new Date().toISOString();
  await writeData(config, data);
  return card;
}

async function upsertCard(config, memberNumber, cardData) {
  const data = await readData(config);
  const profile = data.profiles.find((item) => item.member_number === memberNumber);

  if (!profile) {
    return null;
  }

  const now = new Date().toISOString();
  const existing = findCardByMemberNumber(data, memberNumber);
  const nextCard = {
    member_number: memberNumber,
    token: cardData.token,
    public_url: cardData.public_url,
    qr_svg: cardData.qr_svg || '',
    status: 'active',
    nfc_uid: existing ? existing.nfc_uid || '' : '',
    created_at: existing ? existing.created_at : now,
    updated_at: now,
    last_seen_at: '',
    scan_count: 0
  };

  if (existing) {
    Object.assign(existing, nextCard);
  } else {
    data.cards.push(nextCard);
  }

  profile.updated_at = now;
  await writeData(config, data);

  return {
    profile,
    card: nextCard
  };
}

async function updateMemberPhoto(config, memberNumber, photoUrl) {
  const data = await readData(config);
  const profile = data.profiles.find((item) => item.member_number === memberNumber);

  if (!profile) {
    return null;
  }

  profile.photo_url = photoUrl;
  profile.updated_at = new Date().toISOString();
  await writeData(config, data);

  return {
    profile,
    card: findCardByMemberNumber(data, memberNumber)
  };
}

function findCardByMemberNumber(data, memberNumber) {
  return data.cards.find((item) => item.member_number === memberNumber) || null;
}

function toMemberListItem(data, profile) {
  const card = findCardByMemberNumber(data, profile.member_number);
  return {
    member_number: profile.member_number,
    full_name: profile.full_name,
    specialty: profile.specialty,
    city: profile.city,
    is_active_member: profile.is_active_member,
    has_nfc: Boolean(card && ACTIVE_STATUSES.has(card.status)),
    card_status: card ? card.status : ''
  };
}

module.exports = {
  findPublicCard,
  getMember,
  listMembers,
  searchMembers,
  touchCardScan,
  updateMemberPhoto,
  upsertCard
};
