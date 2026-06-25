function buildVCard(profile, card) {
  const nameParts = splitFullName(profile.full_name);
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCard(nameParts.family)};${escapeVCard(nameParts.given)};${escapeVCard(nameParts.additional)};;`,
    `FN:${escapeVCard(profile.full_name)}`
  ];

  lines.push('ORG:Общество врачей России');

  if (profile.position) {
    lines.push(`TITLE:${escapeVCard(profile.position)}`);
  }

  if (profile.public_phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCard(profile.public_phone)}`);
  }

  if (profile.public_email) {
    lines.push(`EMAIL:${escapeVCard(profile.public_email)}`);
  }

  if (profile.city) {
    lines.push(`ADR;TYPE=WORK:;;;${escapeVCard(profile.city)};;;;`);
  }

  if (card.public_url) {
    lines.push(`URL:${escapeVCard(card.public_url)}`);
  }

  lines.push('END:VCARD');
  return `${lines.join('\r\n')}\r\n`;
}

function splitFullName(fullName = '') {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  return {
    family: parts[0] || '',
    given: parts[1] || '',
    additional: parts.slice(2).join(' ')
  };
}

function buildVCardFilename(profile) {
  const fallback = 'ovr-contact';
  const slug = String(profile.member_number || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${slug || fallback}.vcf`;
}

function escapeVCard(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll('\n', '\\n')
    .replaceAll('\r', '')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,');
}

module.exports = {
  buildVCard,
  buildVCardFilename
};
