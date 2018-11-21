var express = require("express");
var requestRepo = require("../repos/requestRepo");
var driverRepo = require("../repos/driverRepo");

var router = express.Router();

router.post("/request", (req, res) => {
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
        res.json("No request");
      }
    })
    .catch(err => {
      console.log("err when load request");
      res.end(err);
    });
});
router.post("/located", (req, res) => {
  requestRepo
    .located(req.body)
    .then(res.json("Located"))
    .catch(err => {
      console.log("err when load request");
      res.end(err);
    });
});

module.exports = router;


