var parser = require('rss-parser');

module.exports = function (req, res) {
  var name = req.query.name;

  parser.parseURL('https://news.google.com/news/section?output=rss&q=' + name, function(err, parsed) {
    console.log(parsed);
    res.send(parsed);
  });
};
