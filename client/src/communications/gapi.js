module.exports = function () {
  var cachedgapi = null;

  function setGAPI(obj) {
    cachedgapi = obj;
  }

  return {
    setGAPI: setGAPI,
    getGAPI: function () {
      return cachedgapi;
    }
  };
};
