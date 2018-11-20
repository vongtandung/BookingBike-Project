var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync'),
    requestRepo = require('../repos/requestRepo'),
    driverRepo = require('../repos/driverRepo');

    var router= express.Router();
    router.post('/finish',(req,res)=> {
        requestRepo.updateState('Finished', req.body.requestid).then( 
            driverRepo.setFree(req.body.driverid).then(
                res.json(
                    {"mess" : "OK"}
                )
            )
        )
        .catch(err=>{
            console.log(err);
            res.end(err);
        })
    });
    router.post('/updateState',(req,res)=> {
        driverRepo.updateState(req.body).then( 
            res.json(
                {"mess" : "OK"}
            )
        )
        .catch(err=>{
            console.log(err);
            res.end(err);
        })
    });
    router.post('/acceptRequest',(req,res)=>{
        driverRepo.updateRequest(req.body).then(
            driverRepo.setBusy(req.body.driverid).then(
                res.json(
                    {"mess" : "OK"}
                )
            )
            
        )
        .catch(err=>{
            console.log(err);
            res.end(err);
        })
    });
    module.exports = router;