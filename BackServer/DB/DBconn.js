const mysql = require('mysql');

var db = mysql.createConnection({
    host: '43.201.9.45',
    // host: 'localhost',
    port: '3306',
    user: 'woo',
    password: '2460',
    database: 'JikCo'
});

module.exports = db;