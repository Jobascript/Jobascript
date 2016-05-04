const TABLE_NAME = 'users';
const R_TABLE_NAME = 'users_companies';

module.exports = function (db) {
  var Users = {};

  /**
   * Delete all rows in users_companies and users table
   */
  Users.clearAll = function () {
    return db.tx(function (t) {
        return t.none('DELETE FROM ${table~};', {table: R_TABLE_NAME})
            .then(function () {
                return t.none('DELETE FROM ${table~};', {table: TABLE_NAME});
            });
    });
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

  Users.followCompany = function (userID, companyID) {
    var table = 'users_companies';

    var sqlStr = [
      'INSERT INTO ${table~}',
      '(user_id, company_id)',
      'VALUES ( ${userID}, ${companyID} );'
    ].join(' ');

    return db.none(sqlStr, {
      table: table,
      userID: userID,
      companyID: companyID
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };

  Users.unfollowCompany = function (userID, companyID) {
    var table = 'users_companies';

    var sqlStr = [
      'DELETE FROM ${table~}',
      'WHERE user_id=$$${userID}$$ AND company_id=$$${companyID}$$;'
    ].join(' ');

    return db.none(sqlStr, {
      table: table,
      userID: Number(userID),
      companyID: Number(companyID)
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };

  Users.getCompanies = function (userID) {
    var obj = {
      companiesTable: 'companies',
      joinTable: 'users_companies',
      userID: Number(userID)
    };

    var sqlStr = [
      'SELECT ${companiesTable~}.*',
      'FROM ${joinTable~}',
      'INNER JOIN ${companiesTable~}',
      'ON company_id = ${companiesTable~}.id',
      'AND user_id = $$${userID}$$',
      'ORDER BY ${joinTable~}.created;'
    ].join(' ');

    return db.many(sqlStr, obj).catch(function (err) {
      Promise.reject(err);
    });
  };

  return Users;
};
