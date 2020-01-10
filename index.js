const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const app = express();
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render('index', { title: 'Home', message: 'Hello there!' });
});

app.get('/wc', function(req, res) {
  url = req.query.target;
  request(url, function(error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      const sparseArray = $('body')
        .text()
        .replace(/[^A-Za-z]/g, ' ')
        .split(' ');
      const cleanArray = sparseArray.filter(function(el) {
        return el != '';
      });
      let total = 0;
      let tallies = {};
      cleanArray.forEach((word) => {
        if (word.length < 20) {
          total += 1;
          tallies[word] = tallies[word] ? tallies[word] + 1 : 1;
        }
      });
      const frequencies = [];
      Object.values(tallies).forEach((value) => {
        frequencies.push(value);
      });
      const topTenFreq = frequencies
        .sort((a, b) => {
          return b - a;
        })
        .slice(0, 10);
      const topTenWord = {};
      Object.keys(tallies).forEach((values) => {
        topTenFreq.forEach((freq) => {
          if (tallies[values] === freq) {
            topTenWord[values] = freq;
            topTenFreq.splice(topTenFreq.indexOf(freq), 1);
          }
        });
      });
      const result = {};
      Object.keys(topTenWord)
        .sort((a, b) => {
          return topTenWord[b] - topTenWord[a];
        })
        .forEach((key) => {
          result[key] = topTenWord[key];
        });
      res.render('wordCount', {
        title: 'WordCount',
        url: url,
        number: total,
        result: result,
      });
    } else {
      console.log(error);
    }
  });
});

app.listen(3000);
