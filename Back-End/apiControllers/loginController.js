var express = require('express');

var loginRepo = require('../repos/loginRepo');
var authRepo = require('../repos/authRepo');

var router = express.Router();

router.post('/',(req,res)=> {
    loginRepo.login(req.body)
    .then(rows => {
        if (rows.length > 0) {
            var userEntity = rows[0];
            var acToken = authRepo.generateAccessToken(userEntity);
            var rfToken = authRepo.generateRefreshToken();
            authRepo.updateRefreshToken(userEntity.id, rfToken)
                .then(value => {
                    res.json({
                        auth: true,
                        ID: userEntity.id,
                        Name: userEntity.Name,
                        PhoneNumber: userEntity.PhoneNumber,
                        Permission: userEntity.Permission,
                        access_token: acToken
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.statusCode = 500;
                    res.end('View error log on console');
                })
        } else {
            res.json({
                auth: false
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
})

module.exports= router;