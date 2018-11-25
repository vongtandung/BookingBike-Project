var express = require("express"),
  moment = require("moment"),
  low = require("lowdb"),
  fileSync = require("lowdb/adapters/FileSync"),
  adminRepo = require("../repos/adminRepo");
  requestRepo = require("../repos/requestRepo");

var router = express.Router();

router.get("/getAllRequest", (req, res) => {
  adminRepo.GetRequest().then(row => {
    res.json(row);
  });
});
router.post("/getDriverInfo", (req, res) => {
   adminRepo.getDriverDetailInfo(req.body.driverid).then(row =>{
       res.json(row);
   })
})
router.post("/getState", (req, res) => {
  adminRepo
    .getState(req.requestid)
    .then(row => {
      res.json({
        id: requestid,
        state: row[0].State
      });
    })
    .catch(err => {
      console.log("err when get new state");
      res.end(err);
    });
});
module.exports = router;
