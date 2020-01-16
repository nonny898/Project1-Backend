module.exports = {
  jsonOutput: function(res, accept, webCache) {
    res.setHeader('content-type', accept);
    return res.status(200).send(
      JSON.stringify({
        total_words: webCache['total'],
        top10: webCache['topTenArray']
      })
    );
  },
  plainOutput: function(res, accept, webCache) {
    res.setHeader('content-type', accept);
    return res
      .status(200)
      .send(
        'Total number of words = ' +
          webCache['total'] +
          '. Top ten most frequent words = ' +
          webCache['topTenArray']
      );
  },
  htmlOutput: function(res, url, accept, webCache) {
    res.setHeader('content-type', accept);
    return res.status(200).render('wordCount', {
      title: 'WordCount',
      url: url,
      number: webCache['total'],
      result: webCache['topTenArray']
    });
  },
  mainOutput: function(res, url, accept, webCache) {
    if (accept === 'text/plain') {
      this.plainOutput(res, accept, webCache);
    } else if (accept === 'application/json') {
      this.jsonOutput(res, accept, webCache);
    } else {
      this.htmlOutput(res, url, accept, webCache);
    }
  }
};
