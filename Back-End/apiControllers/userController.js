var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync'),
    requestRepo= require('../repos/requestRepo');

    var router= express.Router();

    router.post('/',(req,res)=> {
        requestRepo.addRequest(req.body).then(
        res.end("sucess"))
        .catch(err => {
            console.log("can't book");
            res.end(err);
        })
    });
    router.post('/getDriverInfo',(req,res)=> {
        requestRepo.getInfor(req.body.driverid).then(row =>{
            if(row.length >0)
            {
                console.log(row[0]);
                res.json({
                    driverName: row[0].UserName,
                    driverPhone: row[0].PhoneNumber
                })
            }
            else
            {
                res.json("fail");
            }

        }).catch(err => {
            console.log("process fail");
            res.end(err);
        })
    });


    module.exports = router;