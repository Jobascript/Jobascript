  module.exports = function($sce) {
    return function(stringToParse) {
      return $sce.trustAsHtml(stringToParse);
    };
  };
