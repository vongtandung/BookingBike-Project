var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync'),
    requestRepo = require('../repos/requestRepo');

    var router= express.Router();
    router.post('/finish',(req,res)=> {
        console.log(req)
        requestRepo.updateState('Finished', req.body.requestid).then( 
            res.json(
                {"mess" : "OK"}
            )
        )
        .catch(err=>{
            console.log(err);
            res.end(err);
        })
    });
    module.exports = router;