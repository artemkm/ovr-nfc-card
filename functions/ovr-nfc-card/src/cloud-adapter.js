const { Readable } = require('stream');

function createCloudHandler(route, config) {
  return async function handler(event = {}) {
    const req = createRequest(event);
    const res = createResponse();

    try {
      await route(req, res, config);
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Внутренняя ошибка сервера');
    }

    return res.toCloudResponse();
  };
}

function createRequest(event) {
  const body = decodeBody(event);
  const req = Readable.from(body.length ? [body] : []);

  req.method = getMethod(event);
  req.url = getUrl(event);
  req.headers = normalizeHeaders(event.headers || {});

  return req;
}

function createResponse() {
  const chunks = [];
  const headers = {};
  let statusCode = 200;

  return {
    writeHead(nextStatusCode, nextHeaders = {}) {
      statusCode = nextStatusCode;
      Object.assign(headers, normalizeHeaders(nextHeaders));
    },
    setHeader(name, value) {
      headers[String(name).toLowerCase()] = value;
    },
    end(chunk = '') {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      }
    },
    toCloudResponse() {
      const body = Buffer.concat(chunks);
      const contentType = headers['content-type'] || '';
      const isBinary = body.length > 0 && !isTextContent(contentType);

      return {
        statusCode,
        headers,
        body: isBinary ? body.toString('base64') : body.toString('utf8'),
        isBase64Encoded: isBinary
      };
    }
  };
}

function getMethod(event) {
  return event.httpMethod || event.method || event.requestContext?.http?.method || 'GET';
}

function getUrl(event) {
  const rawPath = event.path || event.rawPath || event.url || '/';

  if (rawPath.includes('?')) {
    return rawPath;
  }

  const params = new URLSearchParams();
  const query = event.queryStringParameters || {};

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `${rawPath}?${queryString}` : rawPath;
}

function decodeBody(event) {
  if (!event.body) {
    return Buffer.alloc(0);
  }

  if (event.isBase64Encoded) {
    return Buffer.from(event.body, 'base64');
  }

  return Buffer.from(String(event.body), 'utf8');
}

function normalizeHeaders(input) {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [String(key).toLowerCase(), value])
  );
}

function isTextContent(contentType) {
  return contentType.startsWith('text/')
    || contentType.includes('application/json')
    || contentType.includes('application/javascript')
    || contentType.includes('image/svg+xml');
}

module.exports = { createCloudHandler };

