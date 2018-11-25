var http = require("http").createServer();
var socketPort = process.env.PORT || 3002;
server = require("socket.io")(socketPort);
requestRepo = require("../Back-End/repos/requestRepo");
driverRepo = require("../Back-End/repos/driverRepo");
var io = server;
var arrayDriver = [];
var arrayLocaIder = [];
var arrayManager = [];
var arrayUser = [];
const MAXIMUM_DRIVER_REQUEST = 3;
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
      requestRepo.updateState("Accepted", resp.requestid).then(() => {
        sendResultToUser(
          requestRepo,
          "server-send-success-response-user",
          resp.requestid
        );
      });
    }
    if (resp.mess === "reject") {
      if (Listarr.length > 1) {
        Listarr.shift();
        ele = arrayDriver.filter((per, index) => {
          return per.id == Listarr[0].driverid;
        });
        console.log("ele", ele);
        for (i = 0; i < ele.length; i++) {
          io.to(ele[i].socketid).emit(
            "server-send-request-driver",
            resp.requestid
          );
        }
      } else {
        requestRepo
          .updateState("Cancel", resp.requestid)
          .then(
            sendResultToUser(
              requestRepo,
              "server-send-fail-response-user",
              resp.requestid
            )
          );
      }
    }
  });
  socket.on("driver-finish", function(userid){
    ele = arrayUser.filter((per, inde) => {
      return per.id == userid;
    });
    for (i = 0; i < ele.length; i++) {
      io.to(ele[i].socketid).emit("finish");
    }
  })
  socket.on("user-send-place", function(data) {
    if (arrayLocaIder.length > 0) {
      const index = Math.floor(Math.random() * arrayLocaIder.length + 0);
      const request = {
        idUser: data.id,
        beginPlace: data.place,
        note: data.note,
        time: Date.now()
      };
      ele = arrayLocaIder.filter((per, inde) => {
        return per.id == arrayLocaIder[index].id;
      });
      requestRepo.addRequest(request).then(row => {
        for (i = 0; i < ele.length; i++) {
          io.to(ele[i].socketid).emit("server-send-place-locate", row.insertId);
        }
      });
    } else {
      console.log("No location Identifier is on");
    }
  });
  socket.on("locate-send-result", function(requestid) {
    sendDriverByListSorted(arrayDriver, requestid).then(arr => {
      Listarr = arr;
    });
  });

  socket.on("disconnect", function() {
    ele = arrayLocaIder.filter((per, index) => {
      return per.socketid === socket.id;
    });
    if (ele[0] != null) {
      console.log("1" + socket.id);
      arrayLocaIder.splice(arrayLocaIder.indexOf(ele[0]), 1);
    } else {
      ele2 = arrayManager.filter((per, index) => {
        return per.socketid === socket.id;
      });
      if (ele2[0] !== null) {
        console.log("2" + socket.id);
        arrayManager.splice(arrayManager.indexOf(ele[0]), 1);
      } else {
        ele2 = arrayDriver.filter((per, index) => {
          return per.socketid === socket.id;
        });
        if (ele2[0] != null) {
          console.log("3" + socket.id);
          arrayDriver.splice(arrayDriver.indexOf(ele[0]), 1);
        } else {
          ele2 = arrayUser.filter((per, index) => {
            return per.socketid === socket.id;
          });
          if (ele2[0] !== null) {
            console.log("4" + socket.id);
            arrayUser.splice(arrayUser.indexOf(ele[0]), 1);
          }
        }
      }
    }
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
function sendDriverByListSorted(array, requestId) {
  return new Promise((resolve, reject) => {
    requestRepo.getLatLngByRequestId(requestId).then(locate => {
      driverRepo.getAllDriverLocate().then(row => {
        if (row.length > 0) {
          for (i = 0; i < row.length; i++) {
            row[i].distance = distanceWithHaversin(
              parseFloat(locate[0].lat),
              parseFloat(locate[0].lng),
              row[i].lat,
              row[i].lng
            );
          }
          row.sort(function(a, b) {
            var x = a.distance;
            var y = b.distance;
            if (x < y) {
              return -1;
            } else {
              return 1;
            }
          });
          var result = row.slice(0, MAXIMUM_DRIVER_REQUEST);
          ele = array.filter((per, index) => {
            return per.id == row[0].driverid;
          });
          for (i = 0; i < ele.length; i++) {
            io.to(ele[i].socketid).emit(
              "server-send-request-driver",
              requestId
            );
          }
        } else {
          sendResultToUser(
            requestRepo,
            "server-send-fail-response-user",
            requestId
          );
        }
        resolve(result);
      });
    });
  });
}
function sendResultToUser(repo, event, id) {
  repo.getUserByRequestId(id).then(row => {
    ele = arrayUser.filter((per, index) => {
      return per.id == row[0].idUser;
    });
    for (i = 0; i < ele.length; i++) {
      io.to(ele[i].socketid).emit(event, row[0].idDriver);
    }
  });
}
