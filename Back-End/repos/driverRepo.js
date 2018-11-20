var db = require('../fn/mysql-db');


exports.updateLocate = (updatereq) => {
    var sql = `update driverlocate set lat = '${updatereq.lat}', lng = '${updatereq.lng}' where driverid = '${updatereq.driverid}'`;
    return db.insert(sql);
};