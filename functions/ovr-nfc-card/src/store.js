const localStore = require('./local-store');
const ydbStore = require('./ydb-store');

function getStore(config) {
  if (config.storage === 'local') {
    return localStore;
  }

  if (config.storage === 'ydb') {
    return ydbStore;
  }

  throw new Error(`Unsupported STORAGE value: ${config.storage}`);
}

module.exports = { getStore };

