

var db = require('../fn/mysql-db');


exports.addRequest = Request => {
    var sql = `INSERT INTO request(idUser, BeginPlace,Time,State) VALUES( '${Request.idUser}','${Request.beginPlace}','${Request.time}',"requesting")`;
    return db.insert(sql);
};
exports.getrequest = (id) => {
    var sql = `select * from request, user where request.id = '${id}'`;
	return db.insert(sql);
};
exports.updateDriver = (iddriver, id) => {
    var sql = `update request set request.idDriver = '${iddriver}' where id = '${id}'`;
    return db.insert(sql);
};
exports.updateState = (state, id) => {
    var sql = `update request set State ='${state}' where id = '${id}'`;
    return db.insert(sql);
};
exports.getRequestId = phone => {
    var sql = `select request.id from request, user where user.PhoneNumber = '${phone}' ORDER BY request.Time DESC LIMIT 1`;
	return db.load(sql);
}