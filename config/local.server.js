const http = require("http");
const fs = require('fs');
const app = require("../app");
const options = {
    key: fs.readFileSync('path/to/private-key.pem'),
    cert: fs.readFileSync('path/to/certificate.pem'),
  };

const port = 5000;
const server = http.createServer(options, app);
server.listen(port);