var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync'),
    adminRepo= require('../repos/adminRepo');

    var router= express.Router();

    router.get('/',(req,res)=> {
        adminRepo.GetRequest().then(row => {
            var data = row[0];
            res.json ({
                id: data
            })

        });
    });
    module.exports = router;