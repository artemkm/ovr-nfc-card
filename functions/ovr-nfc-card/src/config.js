const path = require('path');

function getConfig() {
  const port = Number(process.env.PORT || 3000);
  const basePublicUrl = process.env.BASE_PUBLIC_URL || `http://localhost:${port}`;

  return {
    port,
    basePublicUrl,
    adminUser: process.env.ADMIN_USER || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
    sessionSecret: process.env.SESSION_SECRET || 'local-dev-secret',
    storage: process.env.STORAGE || 'local',
    dataFile: process.env.LOCAL_DATA_FILE || path.resolve(__dirname, '../../../data/local-db.json'),
    seedFile: path.resolve(__dirname, '../../../data/sample-members.json')
  };
}

module.exports = { getConfig };
