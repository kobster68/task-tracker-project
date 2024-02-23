const http = require('http');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = () => {};

http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
