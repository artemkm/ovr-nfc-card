const ACTIVE_STATUSES = new Set(['active']);
const DEFAULT_PAGE_SIZE = 50;

let driverPromise = null;

async function listMembers(config, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const normalizedPage = Math.max(1, Number(page) || 1);
  const normalizedPageSize = Math.max(1, Math.min(100, Number(pageSize) || DEFAULT_PAGE_SIZE));
  const offset = (normalizedPage - 1) * normalizedPageSize;
  const driver = await getDriver(config);

  const rows = await executeQuery(driver, `
    DECLARE $limit AS Uint64;
    DECLARE $offset AS Uint64;

    SELECT
      member_number,
      full_name,
      specialty,
      city,
      is_active_member
    FROM member_profiles VIEW display_order_idx
    ORDER BY display_order
    LIMIT $limit OFFSET $offset;
  `, {
    $limit: typedValue('Uint64', normalizedPageSize),
    $offset: typedValue('Uint64', offset)
  });

  const totalRows = await executeQuery(driver, `
    SELECT COUNT(*) AS total
    FROM member_profiles;
  `);

  const profiles = rows.map(fromYdbRow);
  const cardsByMember = await getCardsByMemberNumbers(driver, profiles.map((profile) => profile.member_number));
  const total = Number(fromYdbRow(totalRows[0] || {}).total || 0);
  const totalPages = Math.max(1, Math.ceil(total / normalizedPageSize));

  return {
    page: normalizedPage,
    page_size: normalizedPageSize,
    total,
    total_pages: totalPages,
    results: profiles.map((profile) => toMemberListItem(profile, cardsByMember.get(profile.member_number)))
  };
}

async function searchMembers(config, query) {
  const needle = String(query || '').trim().toLowerCase();

  if (!needle) {
    return [];
  }

  const driver = await getDriver(config);
  const rows = await executeQuery(driver, `
    DECLARE $needle AS Utf8;

    SELECT
      member_number,
      full_name,
      specialty,
      city,
      is_active_member
    FROM member_profiles
    WHERE search_text LIKE $needle
    LIMIT 20;
  `, {
    $needle: typedValue('Utf8', `%${needle}%`)
  });

  const profiles = rows.map(fromYdbRow);
  const cardsByMember = await getCardsByMemberNumbers(driver, profiles.map((profile) => profile.member_number));
  return profiles.map((profile) => toMemberListItem(profile, cardsByMember.get(profile.member_number)));
}

async function getMember(config, memberNumber) {
  const driver = await getDriver(config);
  const profile = await getProfile(driver, memberNumber);

  if (!profile) {
    return null;
  }

  return {
    profile,
    card: await getCardByMemberNumber(driver, memberNumber)
  };
}

async function findPublicCard(config, token) {
  const driver = await getDriver(config);
  const cardRows = await executeQuery(driver, `
    DECLARE $token AS Utf8;

    SELECT *
    FROM member_cards
    WHERE token = $token;
  `, {
    $token: typedValue('Utf8', token)
  });
  const card = cardRows[0] ? fromYdbRow(cardRows[0]) : null;

  if (!card) {
    return null;
  }

  return {
    profile: await getProfile(driver, card.member_number),
    card
  };
}

async function touchCardScan(config, token) {
  const driver = await getDriver(config);
  await executeQuery(driver, `
    DECLARE $token AS Utf8;
    DECLARE $now AS Timestamp;

    UPDATE member_cards
    SET
      scan_count = COALESCE(scan_count, 0) + 1,
      last_seen_at = $now
    WHERE token = $token;
  `, {
    $token: typedValue('Utf8', token),
    $now: typedValue('Timestamp', new Date())
  });
}

async function upsertCard(config, memberNumber, cardData) {
  const driver = await getDriver(config);
  const profile = await getProfile(driver, memberNumber);

  if (!profile) {
    return null;
  }

  const existing = await getCardByMemberNumber(driver, memberNumber);
  const now = new Date();

  await executeQuery(driver, `
    DECLARE $member_number AS Utf8;

    DELETE FROM member_cards
    WHERE member_number = $member_number;
  `, {
    $member_number: typedValue('Utf8', memberNumber)
  });

  await executeQuery(driver, `
    DECLARE $token AS Utf8;
    DECLARE $member_number AS Utf8;
    DECLARE $public_url AS Utf8;
    DECLARE $status AS Utf8;
    DECLARE $nfc_uid AS Utf8;
    DECLARE $created_at AS Timestamp;
    DECLARE $updated_at AS Timestamp;
    DECLARE $scan_count AS Uint64;

    UPSERT INTO member_cards (
      token,
      member_number,
      public_url,
      status,
      nfc_uid,
      created_at,
      updated_at,
      scan_count
    ) VALUES (
      $token,
      $member_number,
      $public_url,
      $status,
      $nfc_uid,
      $created_at,
      $updated_at,
      $scan_count
    );
  `, {
    $token: typedValue('Utf8', cardData.token),
    $member_number: typedValue('Utf8', memberNumber),
    $public_url: typedValue('Utf8', cardData.public_url),
    $status: typedValue('Utf8', 'active'),
    $nfc_uid: typedValue('Utf8', existing ? existing.nfc_uid || '' : ''),
    $created_at: typedValue('Timestamp', existing ? existing.created_at : now),
    $updated_at: typedValue('Timestamp', now),
    $scan_count: typedValue('Uint64', 0)
  });

  await executeQuery(driver, `
    DECLARE $member_number AS Utf8;
    DECLARE $updated_at AS Timestamp;

    UPDATE member_profiles
    SET updated_at = $updated_at
    WHERE member_number = $member_number;
  `, {
    $member_number: typedValue('Utf8', memberNumber),
    $updated_at: typedValue('Timestamp', now)
  });

  return {
    profile: {
      ...profile,
      updated_at: now.toISOString()
    },
    card: {
      member_number: memberNumber,
      token: cardData.token,
      public_url: cardData.public_url,
      status: 'active',
      nfc_uid: existing ? existing.nfc_uid || '' : '',
      created_at: existing ? existing.created_at : now.toISOString(),
      updated_at: now.toISOString(),
      last_seen_at: '',
      scan_count: 0
    }
  };
}

async function getProfile(driver, memberNumber) {
  const rows = await executeQuery(driver, `
    DECLARE $member_number AS Utf8;

    SELECT *
    FROM member_profiles
    WHERE member_number = $member_number;
  `, {
    $member_number: typedValue('Utf8', memberNumber)
  });

  return rows[0] ? fromYdbRow(rows[0]) : null;
}

async function getCardByMemberNumber(driver, memberNumber) {
  const rows = await executeQuery(driver, `
    DECLARE $member_number AS Utf8;

    SELECT *
    FROM member_cards VIEW member_number_idx
    WHERE member_number = $member_number
    LIMIT 1;
  `, {
    $member_number: typedValue('Utf8', memberNumber)
  });

  return rows[0] ? fromYdbRow(rows[0]) : null;
}

async function getCardsByMemberNumbers(driver, memberNumbers) {
  const cards = new Map();

  for (const memberNumber of memberNumbers) {
    const card = await getCardByMemberNumber(driver, memberNumber);
    if (card) {
      cards.set(memberNumber, card);
    }
  }

  return cards;
}

async function getDriver(config) {
  if (!config.ydbEndpoint || !config.ydbDatabase) {
    throw new Error('YDB_ENDPOINT and YDB_DATABASE are required when STORAGE=ydb');
  }

  if (!driverPromise) {
    driverPromise = createDriver(config);
  }

  return driverPromise;
}

async function createDriver(config) {
  const sdk = loadYdbSdk();
  const authService = sdk.getCredentialsFromEnv
    ? sdk.getCredentialsFromEnv()
    : undefined;
  const driver = new sdk.Driver({
    endpoint: config.ydbEndpoint,
    database: config.ydbDatabase,
    authService
  });

  if (typeof driver.ready === 'function') {
    await driver.ready(10000);
  }

  return driver;
}

function loadYdbSdk() {
  try {
    return require('ydb-sdk');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error('Package ydb-sdk is not installed. Install it before running with STORAGE=ydb.');
    }

    throw error;
  }
}

async function executeQuery(driver, query, params = {}) {
  const sdk = loadYdbSdk();

  if (!driver.tableClient || typeof driver.tableClient.withSession !== 'function') {
    throw new Error('Unsupported ydb-sdk Driver API. Check installed ydb-sdk version.');
  }

  return driver.tableClient.withSession(async (session) => {
    const result = await session.executeQuery(query, params);
    return normalizeResultRows(sdk, result);
  });
}

function typedValue(type, value) {
  const sdk = loadYdbSdk();

  switch (type) {
    case 'Bool':
      return sdk.TypedValues.bool(Boolean(value));
    case 'Timestamp':
      return sdk.TypedValues.timestamp(value instanceof Date ? value : new Date(value));
    case 'Uint64':
      return sdk.TypedValues.uint64(Number(value));
    case 'Utf8':
      return sdk.TypedValues.utf8(String(value));
    default:
      throw new Error(`Unsupported YDB parameter type: ${type}`);
  }
}

function normalizeResultRows(sdk, result) {
  if (result?.resultSets?.[0]) {
    return sdk.TypedData.createNativeObjects(result.resultSets[0]);
  }

  if (Array.isArray(result?.sets?.[0]?.rows)) {
    return result.sets[0].rows;
  }

  if (Array.isArray(result?.rows)) {
    return result.rows;
  }

  return [];
}

function fromYdbRow(row) {
  if (!row || typeof row !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, unwrapYdbValue(value)])
  );
}

function unwrapYdbValue(value) {
  if (value && typeof value === 'object' && 'value' in value) {
    return unwrapYdbValue(value.value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function toMemberListItem(profile, card) {
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
  upsertCard
};
