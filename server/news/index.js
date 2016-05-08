var db = require('../server/database').newsTable;

module.exports = function (req, res) {
  var options = req.query;

  db.getNews(options).then(function (news) {
    res.status(200).send(news);
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  })
};
