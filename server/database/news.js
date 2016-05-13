const TABLE_NAME = 'news';
var _ = require('underscore');

module.exports = function (db) {
  var News = {};

  /**
  * Delete all rows in table
  */
  News.clearAll = function () {
    return db.none('DELETE FROM ${table~};', { table: TABLE_NAME });
  };

  /**
  * @param {Object} news - e.g. {title: '...', url: '...'...}
  * @return {Promise} resolve with news id
  */
  News.addNews = function (news, companyID) {
    /* eslint-disable max-len */
    if (!news) {
      throw new Error('a news obj arg is required! e.g. {title: \'Twitch gets pwnd by newbs\'...}');
    } else if (!news.url) {
      throw new Error('company has to have a url property! e.g. {url: \'www.cnn.com/trump_wins_election\'...}');
    }
    /* eslint-enable */

    news.company_id = news.company_id ? news.company_id : companyID;

    var uniqueStr = [
      'SELECT * FROM ${table~}',
      'WHERE url=$$${url}$$;'
    ].join(' ');

    /* eslint-disable indent */
    var sqlStr = [
      'INSERT INTO ${table~} (',
      Object.keys(news).toString(),
      ') VALUES (',
      _.map(news, function (value) {
        return '$$' + value + '$$';
      }).toString(),
      ') RETURNING id;'
    ].join(' ');
    /* eslint-enable */

    return db.tx('unique-url', function (t) {
      return t.batch([
        t.none(uniqueStr, {
          table: TABLE_NAME,
          url: news.url
        }),
        t.one(sqlStr, { table: TABLE_NAME })
      ]);
    })
    .then(function (results) {
      return results[1].id;
    })
    .catch(function (err) {
      if (err[0] && err[0].success) { // check if it failed the duplicates check
        return Promise.reject(err[1].result);
      }
      return Promise.reject(err);
    });
  };

  /**
  * @param {Object} options obj - e.g. {company_id: 1}
  * @return {Array} Array of news objects
  */
  News.getNews = function (options) {
    var sqlStr = [
      'SELECT * FROM ${table~}',
      'WHERE company_id=${company_id} ORDER BY date_written DESC;'
    ].join(' ');

    return db.query(sqlStr, {
      table: TABLE_NAME,
      company_id: options.company_id
    }).then(function (data) {
      return data;
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };


  /**
  * @param {Number} number corresponding to newsId of article to be removed
  * @return {Promise} resolve with row of article deleted
  */
  News.removeArticle = function (newsID) {
    var sqlStr = [
      'DELETE FROM ${table~}',
      'WHERE id=${id};'
    ].join(' ');

    return db.query(sqlStr, {
      table: TABLE_NAME,
      id: newsID
    }).then(function (row) {
      return row;
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };

  /**
  * No input, no output. Removes news articles that are older than 30 days.
  */
  News.removeOld = function () {
    var sqlStr = [
      'DELETE FROM ${table~}',
      'WHERE date_written < NOW() - INTERVAL \'30 days\''
    ].join(' ');

    return db.query(sqlStr, {
      table: TABLE_NAME
    }).catch(function (err) {
      return Promise.reject(err);
    });
  };

  return News;
};
