module.exports = function ($stateProvider) {
  $stateProvider.state('comm', {
    parent: 'company',
    url: '/communications',
    resolve: {
      emails: function (Comm) {
        return Comm.getEmails(function(emails) {
          return emails;
        }, function(err) {
          console.log('not authorize: ', err);
          return [];
        });
      }
    },
    onEnter: function () {
      var googleScript = document.createElement('script');
      
      googleScript.setAttribute('src', 'https://apis.google.com/js/client.js');
      googleScript.setAttribute('id', 'onetime');

      if (!document.getElementById('onetime')) {
        document.head.appendChild(googleScript);
      }
    },
    controller: 'CommController',
    template: require('./comm.html')
  });
};
