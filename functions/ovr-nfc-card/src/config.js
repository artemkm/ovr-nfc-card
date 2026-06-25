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
    ydbEndpoint: process.env.YDB_ENDPOINT || '',
    ydbDatabase: process.env.YDB_DATABASE || '',
    dataFile: process.env.LOCAL_DATA_FILE || path.resolve(__dirname, '../../../data/local-db.json'),
    uploadDir: process.env.LOCAL_UPLOAD_DIR || path.resolve(__dirname, '../../../data/uploads'),
    seedFile: path.resolve(__dirname, '../../../data/sample-members.json')
  };
}

module.exports = { getConfig };
