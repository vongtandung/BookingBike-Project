var db = require('../fn/mysql-db');


exports.updateState = (updatereq) => {
    var sql = `update driverlocate set lat = '${updatereq.lat}', lng = '${updatereq.lng}' , st='${updatereq.state}' where driverid = '${updatereq.driverid}'`;
    return db.insert(sql);
};
exports.updateRequest = request =>{
    console.log(request);
    var sql = `update request set idDriver = '${request.driverid}', State='Waiting' where id = '${request.id}'`;
    return db.insert(sql);
}
exports.setBusy =(driverid) =>{
    var sql = `update driverlocate set st=0 where driverid = '${driverid}'`;
    return db.insert(sql);
}
exports.setFree =(driverid) =>{
    var sql = `update driverlocate set st=1 where driverid = '${driverid}'`;
    return db.insert(sql);
}
