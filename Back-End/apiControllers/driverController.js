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
    router.post("/getRequestInfo", (req, res) => {
        requestRepo
          .getrequest(req.body.requestid)
          .then(row => {
            if (row.length > 0) {
              res.json({
                requestid: req.body.requestid,
                place: row[0].BeginPlace,
                note: row[0].Note,
                userid: row[0].idUser,
                userphone: row[0].PhoneNumber,
                username: row[0].Name
              });
            } else {
              res.json("request is not esxit ");
            }
          })
          .catch(err => {
            console.log("err when load request");
            res.end(err);
          });
      });
    module.exports = router;