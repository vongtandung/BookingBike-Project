var md5 = require('crypto-md5');

var db = require('../fn/mysql-db');


exports.login = loginEntity => {
    var md5_pwd = md5(loginEntity.pwd);
    var sql = `select * from user where UserName ='${loginEntity.user}' and PassWord = '${md5_pwd}' `;
    return db.load(sql);
}
exports.load = function(id) {
    var sql = `select * from user where id = ${id}`;
    return db.load(sql);
}