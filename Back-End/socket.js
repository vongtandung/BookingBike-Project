var http = require("http").createServer();
var socketPort = process.env.PORT || 3002;
server = require("socket.io")(socketPort);
requestRepo = require("../Back-End/repos/requestRepo");
var io = server;
var arrayDriver = [];
var arrayLocaIder = [];
var arrayManager = [];
var arrayUser = [];
const numberDriver = 5;
io.on("connection", function(socket) {
  console.log(socket.id);
  console.log("name: " + socket.handshake.query.name);
  person = {
    socketid: socket.id,
    name: socket.handshake.query.name,
    id: socket.handshake.query.id,
    permission: socket.handshake.query.permission
  };
  Listarr = [];
  if (socket.handshake.query.permission === "1") {
    console.log("User " + person.name + " Is connect");
    arrayUser.push(person);
  } else {
    if (socket.handshake.query.permission === "2") {
      console.log("Location Identifier " + person.name + " Is connect");
      arrayLocaIder.push(person);
    } else {
      if (socket.handshake.query.permission === "3") {
        console.log("Manager " + socket.handshake.query.name + " Is connect");
        arrayManager.push(person);
      } else {
        if (person.permission === "4") {
          console.log("Driver " + person.name + " Is connect");
          arrayDriver.push(person);
        }
      }
    }
  }
  socket.on("driver-send-response", function(resp) {
    if (resp.mess === "accept") {
     sendResultToUser("server-send-success-response-user", resp);
    }
    if (resp.mess === "reject") {
      if (listarr.length > 2) {
        listarr.splice(0, 1);
        ele = arrayDriver.filter((per, index) => {
          return per.id === listarr[0].driverid;
        });
        for (i = 0; i < ele.length; i++) {
          io.to(ele[i].socketid).emit("server-send-request-driver", resp.requestid);
        }
      } else {
        sendResultToUser("server-send-fail-response-user",resp.requestid);
      }
    }
  });
  socket.on("user-send-place", function(data) {
    if (arrayLocaIder.length > 0) {
      const index = Math.floor(Math.random() * arrayLocaIder.length + 0);
      const request = {
        idUser: data.id,
        beginPlace: data.place,
        time: Date.now()
      };
      console.log("array kocate leng: " + arrayLocaIder.length);
      requestRepo.addRequest(request).then(
        requestRepo.getRequestId(data.phone).then(row => {
          io.to(arrayLocaIder[index].socketid).emit(
            "server-send-place-locate",
            row[0].id
          );
        })
      );
    } else {
      console.log("No location Identifier is on");
    }
  });
  socket.on("locate-send-result", function(requestid) {
    listarr = getDriverListSorted();
    if (listarr.length > 0) {
      ele = arrayDriver.filter((per, index) => {
        return per.id === listarr[0].driverid;
      });
      for (i = 0; i < ele.length; i++) {
        io.to(ele[i].socketid).emit("server-send-request-driver", requestid);
      }
    } else {
      sendResultToUser("server-send-fail-response-user",requestid);
    }
  });

  socket.on("disconnect", function() {
    if (person.permission === "2") {
      ele = arrayLocaIder.filter((per, index) => {
        return per.socketid === socket.id;
      });
      arrayLocaIder.splice(arrayLocaIder.indexOf(ele[0]), 1);
    } else {
      if (person.permission === "3") {
        ele = arrayManager.filter((per, index) => {
          return per.socketid === socket.id;
        });
        arrayManager.splice(arrayManager.indexOf(ele[0]), 1);
      } else {
        if (person.permission === "4") {
          ele = arrayDriver.filter((per, index) => {
            return per.socketid === socket.id;
          });
          arrayDriver.splice(arrayDriver.indexOf(ele[0]), 1);
        } else {
          ele = arrayUser.filter((per, index) => {
            return per.socketid === socket.id;
          });
          arrayUser.splice(arrayUser.indexOf(ele[0]), 1);
        }
      }
    }
    console.log(person.socketid + "is disconect");
  });
});

console.log(`WS running on port ${socketPort}`);

module.exports = {
  io
};

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
function getDriverListSorted() {
  driverRepo.getAllDriverLocate().then(row => {
    if (row.length > 0) {
      for (i = 0; i < row.length; i++) {
        row[i].distance = distanceWithHaversin(
          req.body.lat,
          req.body.lng,
          row[i].lat,
          row[i].lng
        );
      }
      return row.sort(function(a, b) {
        var x = a.distance;
        var y = b.distance;
        if (x < y) {
          return -1;
        } else {
          return 1;
        }
      });
    } else {
      return;
    }
  });
}
function sendResultToUser(event, requestid){
  requestRepo.getUserByRequestId(requestid).then(row => {
    ele = arrayUser.filter((per, index) => {
      return per.id === row[0].idUser;
    });
    for (i = 0; i < ele.length; i++) {
      io.to(ele[i].id).emit(event, requestid);
    }
  });
}