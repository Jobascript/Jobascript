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

  Users.updateUser = function (userID, args) {
    /* eslint-disable no-multi-spaces */
    // check to see if user exisit
    var checkIDSql        = 'SELECT id FROM ${table~} WHERE id=$$${user_id}$$;';
    // check username collision
    var checkUsernameSql  = 'SELECT id FROM ${table~} WHERE username=$$${username}$$;';
    var updateSql         = 'UPDATE ${table~} SET ' + helpers.toSqlString(args, ',') +
                            ' WHERE id=$$${user_id}$$;';
    /* eslint-enable */

    return db.tx(function (t) {
      var tasks = [];
      
      var checkIfUserExists = t.one(checkIDSql, {
        table: TABLE_NAME,
        user_id: Number(userID)
      });

      tasks.push(checkIfUserExists);
      
      if (args.username) {
        var checkIfUsernameCollision = t.none(checkUsernameSql, {
          table: TABLE_NAME,
          username: args.username
        });
        tasks.push(checkIfUsernameCollision);
      }

      var doUpdate = t.none(updateSql, {
        table: TABLE_NAME,
        user_id: Number(userID)
      });
      
      tasks.push(doUpdate);

      return t.batch(tasks);
    })
    .catch(function (err) {
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
      'SELECT ${companiesTable~}.*, ${joinTable~}.created AS followed_on',
      'FROM ${joinTable~}',
      'INNER JOIN ${companiesTable~}',
      'ON company_id = ${companiesTable~}.id',
      'AND user_id = $$${userID}$$',
      'ORDER BY ${joinTable~}.created DESC;'
    ].join(' ');

    return db.many(sqlStr, obj).catch(function (err) {
      Promise.reject(err);
    });
  };

  return Users;
};
