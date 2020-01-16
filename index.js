const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const AsyncLock = require('async-lock');

const wordCount = require('./wordCount');
const outPut = require('./output');

const lock = new AsyncLock();

const app = express();
app.set('view engine', 'pug');

const cache = {};

app.get('/', function(req, res) {
  res.status(200);
});

app.get('/wc', function(req, res) {
  // console.log('Running...');
  const url = req.query.target;
  lock.acquire(
    url,
    function(done) {
      request(url, function(error, response, html) {
        if (!error) {
          const force = req.query.force;
          let accept = req.headers.accept;
          if (accept === undefined) {
            accept = 'text/html';
          } else {
            accept = accept.split(',')[0];
          }
          const allURL = Object.keys(cache);
          // console.log('Checking for cache...');
          if (allURL.length > 10) {
            const oldest = allURL[0];
            delete cache[oldest];
          }
          const etag = response.headers.etag;
          const webCache = cache[url];
          if (force !== 'true' && url in cache && etag === webCache['etag']) {
            res.setHeader('Cache-Control', 'from-cache');
            outPut.mainOutput(res, url, accept, webCache);
          } else {
            res.setHeader('Cache-Control', 'no-cache');
            const $ = cheerio.load(html);
            cache[url] = wordCount.counter($('body'), etag);
            const webCache = cache[url];
            outPut.mainOutput(res, url, accept, webCache);
          }
        } else {
          // console.log('there is something wrong with the target');
          res.send('Target URL problem.');
        }
      });
      done();
    },
    function(err, ret) {}
  );
});

app.get('*', (req, res, next) => {
  res.status(200).send('Sorry, requested page not found.');
  next();
});

app.listen(3000);

module.exports = app;
