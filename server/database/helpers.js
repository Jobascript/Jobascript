var _ = require('underscore');

// turn obj into sql str, e.g. {a:1, b:2} => 'a=1, b="blah"'
  // joinWith needs to be a String 'AND', 'OR' or ','
exports.toSqlString = function (obj, joinWith) {
  var tuples = _.pairs(obj);

  var string = tuples.map(function (tuple) {
    var t = tuple.slice();
    var str;
    var operator = '=';

    if (t[1] === null) {
      operator = ' IS ';
      t[1] = String(t[1]).toUpperCase();
    } else {
      t[1] = '$$' + t[1] + '$$'; // escape stuff
    }

    str = t[0] + operator + t[1];

    return str;
  }).join(' ' + joinWith + ' ');

  return string;
};
