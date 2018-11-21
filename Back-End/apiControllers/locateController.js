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
router.post("/driverlist", (req, res) => {
  driverRepo
    .getAllDriverLocate()
    .then(row => {
      if (row.length > 0) {
        for (i = 0; i < row.length; i++) {
          row[i].distance = distanceWithHaversin(
            req.body.lat,
            req.body.lng,
            row[i].lat,
            row[i].lng
          );
        }
        row.sort(function(a,b){
            var x =  a.distance;
            var y = b.distance;
            if(x<y) {return -1}
            else{return 1};
        });
        res.json(row);
      }
      else{
          res.end("No driver is found");
      }
    })
    .catch(err => {
      console.log("err when find driver");
      res.end(err);
    });
});

module.exports = router;

function distanceWithHaversin(lat1, lon1, lat2, lon2) {
  var R = 6371e3; // metres
  var p1 = toRadians(lat1);
  var p2 = toRadians(lat2);
  var dentalat = toRadians(lat2 - lat1);
  var dentalon = toRadians(lon2 - lon1);

  var a =
    Math.sin(dentalat / 2) * Math.sin(dentalat / 2) +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(dentalon / 2) *
      Math.sin(dentalon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
function toRadians(Value) {
  return (Value * Math.PI) / 180;
}
