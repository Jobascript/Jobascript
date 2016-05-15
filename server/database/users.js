var Promise = require('bluebird');
var helpers = require('./helpers.js');

const TABLE_NAME = 'users';
const R_TABLE_NAME = 'users_companies';

module.exports = function (db) {
  var Users = {};

  /**
   * Delete all rows in users_companies and users table
   */
  Users.clearAll = function () {
    return db.tx(function (t) {
      return t.none('DELETE FROM ${table~};', { table: R_TABLE_NAME })
      .then(function () {
        return t.none('DELETE FROM ${table~};', { table: TABLE_NAME });
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

    var queryUserSql = [
      'SELECT * FROM ${table~}',
      'WHERE ' + (user ? helpers.toSqlString(user) : 'true=false') + ';'
    ].join(' ');

    var insertSql = [
      'INSERT INTO ${table~}',
      !!user ? '(username)' : '(temp)',
      'VALUES (',
      '${username}',
      ') RETURNING id, username, created, temp;'
    ].join(' ');

    return db.tx(function (t) {
      return t.batch([
        db.none(queryUserSql, {
          table: TABLE_NAME
        }),
        db.one(insertSql, {
          table: TABLE_NAME,
          username: !!user ? user.username : true
        })
      ]);
    }).then(function (results) {
      return results.pop();
    });
  };

  /**
   * Retreive an user
   * @param  {Object} args  { username: 'jake' } OR { id: 7231 }
   * @return {Promise}      resolve to an user object
   */
  Users.getUser = function (args) {
    if (!args) return Promise.reject('must provide args');

    var sqlStr = 'SELECT * FROM ${table~}';

    if (args.username) {
      sqlStr += ' WHERE username=$$' + args.username + '$$';
    } else if (args.id) {
      sqlStr += ' WHERE id=$$' + args.id + '$$';
    } else {
      return Promise.reject('must provide id or username');
    }

    return db.one(sqlStr, {
      table: TABLE_NAME
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };

  // check user is temp
  Users.isUserTemp = function (userID) {
    var sqlStr = 'SELECT temp FROM users WHERE id=$$${user_id}$$';

    return db.one(sqlStr, { user_id: Number(userID) })
    .then(function (res) {
      return res.temp;
    });
  };

  // return user - id, username, temp, created
  Users.updateUser = function (userID, args) {
    var columns = args;
    if (columns.username) {
      columns.temp = false; // for sign up
    }

    /* eslint-disable no-multi-spaces */
    // check to see if user exisit
    var checkIDSql        = 'SELECT * FROM ${table~} WHERE id=$$${user_id}$$;';
    // check username collision
    var checkUsernameSql  = 'SELECT * FROM ${table~} WHERE username=$$${username}$$;';
    var updateSql         = 'UPDATE ${table~} SET ' + helpers.toSqlString(columns, ',') +
                            ' WHERE id=$$${user_id}$$ RETURNING id, username, temp, created;';
    /* eslint-enable */

    return db.tx(function (t) {
      var tasks = [];

      var checkIfUserExists = t.one(checkIDSql, {
        table: TABLE_NAME,
        user_id: Number(userID)
      });

      tasks.push(checkIfUserExists);

      if (columns.username) {
        var checkIfUsernameCollision = t.none(checkUsernameSql, {
          table: TABLE_NAME,
          username: columns.username
        });
        tasks.push(checkIfUsernameCollision);
      }

      var doUpdate = t.one(updateSql, {
        table: TABLE_NAME,
        user_id: Number(userID)
      });

      tasks.push(doUpdate);

      return t.batch(tasks);
    })
    .then(function (res) {
      return res.pop(); // result from last operation
    })
    .catch(function (err) {
      return Promise.reject(err);
    });
  };

  Users.followCompany = function (user, company) {
    var table = 'users_companies';

    var sqlStr = [
      'INSERT INTO ${table~}',
      '(user_id, company_id)',
      'VALUES ( ${userID},',
      company.id ? '$$' + company.id + '$$);' :
      '(SELECT id FROM companies WHERE domain=$$' + company.domain + '$$));'
    ].join(' ');

    return db.none(sqlStr, {
      table: table,
      userID: user.id
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
      'SELECT ${companiesTable~}.*, ${joinTable~}.created AS followed_on',
      'FROM ${joinTable~}',
      'INNER JOIN ${companiesTable~}',
      'ON company_id = ${companiesTable~}.id',
      'AND user_id = $$${userID}$$',
      'ORDER BY ${joinTable~}.created DESC;'
    ].join(' ');

    return db.manyOrNone(sqlStr, obj);
  };

  return Users;
};
