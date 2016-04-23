module.exports = function ($http) {
  var getJobs = function () {
    return [1, 2, 3, 4];
  };

  return {
    getJobs: getJobs
  };
};
