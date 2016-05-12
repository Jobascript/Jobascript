var jobTable = require('../database').jobsTable;
var _ = require('underscore');

module.exports = function (req, res) {
  var q = _.pick(req.query, 'company_id');

  jobTable.getJobs(q).then(function (jobs) {
    res.status(200).send(jobs);
  })
  .catch(function (err) {
    res.sendStatus(500);
    console.log('GET /jobs', err);
  });
};
