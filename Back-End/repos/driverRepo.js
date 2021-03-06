var db = require('../fn/mysql-db');


exports.updateState = (updatereq) => {
    var sql = `update driverlocate set lat = ${updatereq.lat}, lng = ${updatereq.lng} , st='${updatereq.state}' where driverid = '${updatereq.driverid}'`;
    return db.insert(sql);
};
exports.updateRequest = request => {
    var sql = `update request set idDriver = '${request.driverid}', State='Waiting' where id = '${request.requestid}'`;
    return db.insert(sql);
}
exports.updateLocate = request => {
    var sql = `insert into driverlocate (driverid, lat,lng,st) values (${request.driverid},${request.lat},${request.lng}, '1') on duplicate key update lat= ${request.lat}, st=1,lng = ${request.lng}`;
    //var sql = `update driverlocate set lat= ${request.lat}, st=1,lng = ${request.lng} where driverid = '${request.driverid}'`;
    return db.insert(sql);
}
exports.setBusy = (driverid) => {
    var sql = `update driverlocate set st=0 where driverid = ${driverid}`;
    return db.insert(sql);
}
exports.setFree = (driverid) => {
    var sql = `update driverlocate set st=1 where driverid = '${driverid}'`;
    return db.insert(sql);
}
exports.setRequest = (driverid) => {
    var sql = `update driverlocate set st=2 where driverid = '${driverid}'`;
    return db.insert(sql);
}
exports.getAllDriverLocate = () => {
    var sql = `select * from driverlocate where st = 1`;
    return db.load(sql);
}