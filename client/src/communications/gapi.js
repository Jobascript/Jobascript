module.exports = function () {
  var gapi = null;

  function setGAPI(obj) {
    gapi = obj;
  }

  return {
    setGAPI: setGAPI,
    getGAPI: function () {
      return gapi;
    }
  };
};
