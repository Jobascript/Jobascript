const TABLE_NAME = 'users';

module.exports = function (db) {
  var Users = {};

  /**
   * Delete all rows in table
   */
  Users.clearAll = function () {
    return db.none('DELETE FROM ${table~};', { table: TABLE_NAME });
  };
  
  /**
   * Create an user
   * @param  {Object} props optional: { username: 'jake' },
   *                        username will be assigned
   *                        if none is provided
   * @return {Promise}      resolve to an user object
   */
  Users.createUser = function (props) {
    var user = props || false;
    var sqlStr = [
      'INSERT INTO ${table~}',
      !!user ? '(username)' : '(temp)',
      'VALUES (',
      '${username}',
      ') RETURNING id, username, created;'
    ].join(' ');

    return db.one(sqlStr, {
      table: TABLE_NAME,
      username: !!user ? user.username : true
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };

  Users.followCompany = function (company) {
    var table = 'users_companies';

    var sqlStr = [
      'INSERT INTO ${table~}',
      '(user_id, company_id)'
    ].join(' ');
  };

  return Users;
};
