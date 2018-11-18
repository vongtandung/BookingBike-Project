var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync'),
    requestRepo= require('../repos/requestRepo');

    var router= express.Router();

    router.post('/',(req,res)=> {
        requestRepo.addRequest(req.body).then(
        res.end("sucess"));
    });




    module.exports = router;