const http = require('http');

const { getConfig } = require('./src/config');
const { route } = require('./src/router');

const config = getConfig();

const server = http.createServer((req, res) => {
  route(req, res, config).catch((error) => {
    console.error(error);
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Внутренняя ошибка сервера');
  });
});

server.listen(config.port, () => {
  console.log(`OVR NFC MVP is running at http://localhost:${config.port}/admin`);
});

