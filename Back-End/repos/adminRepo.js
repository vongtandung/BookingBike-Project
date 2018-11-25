var db = require('../fn/mysql-db');


/*exports.GetRequest  = () => {
    var sql = `select request.id as id, request.BeginPlace,request.lat, request.lng, user.Name, user.PhoneNumber, request.State from request , user  where request.idUser = user.id ORDER BY request.Time DESC `;
	return db.load(sql);
};
*/
exports.GetRequest  = () => {
    var sql = `select request.id as id, request.BeginPlace,request.lat as UserLat, request.lng as UserLng , user.Name as UserName, user.PhoneNumber as UserPhone, request.State , request.idDriver from request , user  where request.idUser = user.id ORDER BY request.Time DESC `;
	return db.load(sql);
};
exports.getDriverDetailInfo =(id) =>{
    var sql = `select user.Name as DriverName, user.PhoneNumber as DriverPhone, driverlocate.lat as DriverLat, driverlocate.lng as DriverLng from user, driverlocate where user.id=${id} and user.id=driverlocate.driverid `;
	return db.load(sql);
};
exports.getState  = (requestid) => {
    var sql = `select State from request where id = ${requestid}`;
	return db.load(sql);
};
exports.getMoreInfo  = (id) => {
    var sql = `select * from user,driverlocate where user.id = driverlocate.driverid and user.id= ${id} `;
	return db.load(sql);
};