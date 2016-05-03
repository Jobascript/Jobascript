var usersTable = require('./database').usersTable;

usersTable.createUser().then(function (user) {
  console.log('user ', user);
});
