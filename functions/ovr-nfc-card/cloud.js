const { createCloudHandler } = require('./src/cloud-adapter');
const { getConfig } = require('./src/config');
const { route } = require('./src/router');

const handler = createCloudHandler(route, getConfig());

module.exports = { handler };

