var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');
    
var userCtrl = require('./apiControllers/userController');
var driverCtrl = require('./apiControllers/driverController');
var loginCtrl = require('./apiControllers/loginController');

var app= express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

require('./socket')
app.use('/api/user/', userCtrl);
app.use('/api/driver/', driverCtrl);
app.use('/api/login/', loginCtrl);

var PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
});