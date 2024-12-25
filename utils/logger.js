const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Write logs to a file
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../../access.log'), { flags: 'a' });
module.exports = morgan('combined', { stream: accessLogStream });