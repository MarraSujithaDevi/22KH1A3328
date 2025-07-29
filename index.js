const express = require('express');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');  // Make sure logger.js exists
const app = express();
app.use(express.json());
app.use(logger); 
const urlDatabase = {};
function generateShortCode() {
  return uuidv4().slice(0, 6);
}
app.post('/shorten', (req, res) => {
  const { originalUrl, validity } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required' });
  }
  const shortCode = generateShortCode();
  const expiry = validity
    ? Date.now() + validity * 1000
    : Date.now() + 24 * 60 * 60 * 1000; // Default 1 day
  urlDatabase[shortCode] = { originalUrl, expiry };
  res.json({
    shortUrl: `http://localhost:3000/${shortCode}`,
    expiry,
  });
});
app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const record = urlDatabase[shortCode];
  if (!record) {
    return res.status(404).json({ message: 'Short URL not found' });
  }
  if (Date.now() > record.expiry) {
    return res.status(410).json({ message: 'URL has expired' });
  }
  res.redirect(record.originalUrl);
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
