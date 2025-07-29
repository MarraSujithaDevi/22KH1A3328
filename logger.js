const fs = require('fs');
const path = require('path');
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.url}\n`;
  logStream.write(log);
  next();
};
module.exports = logger;