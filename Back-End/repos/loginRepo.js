var md5 = require('crypto-js/md5');

var db = require('../fn/mysql-db');


exports.login = loginEntity => {
    var md5_pwd = md5(loginEntity.pwd);
    console.log(md5_pwd);
    var sql = `select * from user where UserName ='${loginEntity.user}' and PassWord = '${md5_pwd}' `;
    return db.load(sql);
}
