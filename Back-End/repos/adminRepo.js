var db = require('../fn/mysql-db');


exports.GetRequest  = () => {
    var sql = 'select * from request , user as us1, user as us2  where request.idUser = us1.id and request.idDriver = us2.id ';
	return db.load(sql);
};
