module.exports = function ($stateProvider) {
  /* globals gapi */
  $stateProvider
  .state('comm', {
    parent: 'company',
    url: '/communications',
    // resolve: {
    //   gapi: function ($document) {
    //     console.log('inside resolve');

    //     // var $googleScript = $('<script>');
    //     // $googleScript.attr('src', 'https://apis.google.com/js/client.js');
    //     // $googleScript.attr('id', 'onetime');

    //     // console.log('script tag', googleScript);

    //     return new Promise(function (resolve, reject) {
    //       var googleScript = angular.element('<script/>');
    //       googleScript.onload(function () {
    //         console.log('gapi loaded');
    //         resolve(gapi);
    //       });
    //       googleScript.attr('src', 'https://apis.google.com/js/client.js');
    //       googleScript.attr('id', 'onetime');

    //       console.log('inside resolve p', googleScript);

    //       if (!$('#onetime')) {
    //         googleScript.appendTo('head');
    //         console.log('script appended');
    //       } else {
    //         console.log('script already loaded');
    //         resolve(gapi);
    //       }
    //       // reject('no script');
    //     }).catch(function (err) {
    //       console.log(err);
    //     });
    //   }
    // },
    onEnter: function () {
      var googleScript = window.document.createElement('script');
      googleScript.setAttribute('src', 'https://apis.google.com/js/client.js');
      googleScript.setAttribute('id', 'onetime');

      if (!window.document.getElementById('onetime')) {
        window.document.head.appendChild(googleScript);
      }
    },
    // resolve: {
    //   emails: function (Comm) {
    //     return Comm.getEmails(function (emails) {
    //       return emails;
    //     }, function (err) {
    //       console.log('not authorize: ', err);
    //       return [];
    //     });
    //   }
    // },
    controller: 'CommController',
    template: require('./comm.html') })
  .state('email', {
    resolve: {
      message: function ($stateParams) {
        return new Promise(function (resolve, reject) {
          console.log('new promise');
          var messageRequest = gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: $stateParams.message_id
          });
          messageRequest.execute(function (messageResp) {
            if (messageResp) {
              console.log('promise resolved');
              resolve(messageResp);
            } else {
              console.log('promise rejected');
              reject();
            }
          });
        });
      }
    },
    parent: 'comm',
    url: '/messages/:message_id',
    controller: function ($scope, $state, $sce, Comm, message) {
      var current = {};
      var headers = message.payload.headers;
      var body = message.result.payload.parts[1];
      var bodydata = body.body.data;
      var finalbodydata = bodydata.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
      var realfinalbodydata = decodeURIComponent(escape(window.atob(finalbodydata)));
      current.date = Comm.getHeader(headers, 'Date');
      current.from = Comm.getHeader(headers, 'From');
      current.subject = Comm.getHeader(headers, 'Subject');
      current.body = realfinalbodydata;
      $scope.message = current;
      $scope.email = $sce.trustAsHtml(realfinalbodydata);
    },
    template: require('./mail.html')
  });
};
