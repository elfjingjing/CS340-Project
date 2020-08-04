var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_lishan',
  password        : '6689',
  database        : 'cs340_lishan'
});

module.exports.pool = pool;
