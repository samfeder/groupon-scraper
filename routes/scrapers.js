const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  request('https://news.ycombinator.com', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      console.log('hey bro');
    }
  });
});

module.exports = router;
