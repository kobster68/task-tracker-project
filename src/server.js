const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getTasks': jsonHandler.getTasks,
  },
  HEAD: {
    notFound: jsonHandler.notFound,
  },
  POST: {
    '/setTask': jsonHandler.setTask,
  },
};

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

const handleGet = (request, response, parsedUrl) => {
  urlStruct.GET[parsedUrl.pathname](request, response);
};

const handlePost = (request, response, parsedUrl) => {
  parseBody(request, response, urlStruct.POST[parsedUrl.pathname]);
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'GET') {
    return handleGet(request, response, parsedUrl);
  }
  if (request.method === 'POST') {
    return handlePost(request, response, parsedUrl);
  }

  return urlStruct.HEAD.notFound(request, response);
};

http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
