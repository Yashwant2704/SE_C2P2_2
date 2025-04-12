// backend/routes/apiTest.js
const express = require('express');
const router = express.Router();

router.all('/test', (req, res) => {
  const misuses = [];

  if (req.method !== 'POST') {
    misuses.push('❌ API should use POST method');
  }

  if (!req.headers.authorization) {
    misuses.push('❌ Missing Authorization header');
  }

  if (req.method === 'GET' && req.body && Object.keys(req.body).length > 0) {
    misuses.push('❌ GET method should not have a body');
  }

  if (misuses.length > 0) {
    return res.json({ safe: false, message: `API Misuse Detected:\n` + misuses.join('\n') });
  }

  return res.json({ safe: true, message: '✅ API used securely!' });
});

module.exports = router;
