module.exports = {
  counter: function(body, etag) {
    const sparseArray = body
      .text()
      .replace(/\b[^A-Za-z]{1,20}/g, ' ')
      .split(' ');
    const cleanArray = sparseArray.filter(function(el) {
      return el != '';
    });
    let total = cleanArray.length;
    let tallies = {};
    cleanArray.forEach(word => {
      if (word.length < 20) {
        tallies[word] = tallies[word] ? tallies[word] + 1 : 1;
      }
    });
    const frequencies = [];
    Object.values(tallies).forEach(value => {
      frequencies.push(value);
      frequencies.sort((a, b) => {
        return b - a;
      });
    });
    const topTenArray = [];
    const keys = Object.keys(tallies);
    for (const freq of frequencies) {
      for (const key of keys) {
        if (tallies[key] === freq && !topTenArray.includes(key)) {
          topTenArray.push(key + ': ' + tallies[key]);
        }
      }
    }
    const resultArray = topTenArray.slice(0, 10);
    return {
      etag: etag,
      total: total,
      topTenArray: resultArray
    };
  }
};
