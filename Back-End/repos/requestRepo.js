

var db = require('../fn/mysql-db');


exports.addRequest = Request => {
    var sql = `INSERT INTO request(idUser, BeginPlace,Note,Time,State) VALUES( '${Request.idUser}','${Request.beginPlace}','${Request.note}',${Request.time},"requesting")`;
    return db.insert(sql);
};
exports.getrequest = (id) => {
    var sql = `select * from request, user where request.id = '${id}' and request.idUser = user.id`;
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
    var sql = `select request.id from request, user where user.PhoneNumber = '${phone}' ORDER BY request.id DESC LIMIT 1`;
    return db.load(sql);
};
exports.located = Request => {
    var sql = `update request set State = "located", request.lat = '${Request.lat}', request.lng ='${Request.lng}' where id = '${Request.id}'`;
    return db.insert(sql);
}
exports.getInfor = id => {
    var sql = `select * from user where id = '${id}'`;
    return db.insert(sql);
}
exports.getUserByRequestId = requestid => {
    var sql = `select * from request where id = '${requestid}'`;
    return db.load(sql);
}
exports.getLatLngByRequestId = requestid => {
    var sql = `select * from request where id = '${requestid}'`;
    return db.load(sql);
}