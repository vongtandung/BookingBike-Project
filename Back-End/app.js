var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');
    
var userCtrl = require('./apiControllers/userController');
var driverCtrl = require('./apiControllers/driverController');
var loginCtrl = require('./apiControllers/loginController');
var adminCtrl = require('./apiControllers/admincontroller');
var locateCtrl = require('./apiControllers/locateController');
var verifyAccessToken = require('./repos/authRepo').verifyAccessToken;

var app= express();
app.use(morgan('dev'));
app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); next(); });
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./socket')
app.use('/api/user/', userCtrl);
app.use('/api/driver/',verifyAccessToken, driverCtrl);
app.use('/api/login/',verifyAccessToken, loginCtrl);
app.use('/api/admin/',verifyAccessToken, adminCtrl);
app.use('/api/locate/',verifyAccessToken, locateCtrl);

var PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
});