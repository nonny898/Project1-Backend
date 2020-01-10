const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const app = express();
app.set('view engine', 'pug');

let tallies = {};

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
      console.log(cleanArray.length);
      cleanArray.forEach((word) => {
        if (word.length < 20) {
          tallies[word] = tallies[word] ? tallies[word] + 1 : 1;
        }
      });
      res.render('wordCount', { title: 'WordCount', number: cleanArray });
    } else {
      console.log(error);
    }
  });
});

app.listen(3000);
