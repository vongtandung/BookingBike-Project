var http = require("http").createServer();
var socketPort = process.env.PORT || 3002;
server = require("socket.io")(socketPort);
requestRepo = require("../Back-End/repos/requestRepo");
var io = server;
var arrayDriver = [];
var arrayLocaIder = [];
var arrayManager = [];
const numberDriver = 5;
io.on("connection", function(socket) {
  console.log(socket.id);
  console.log("name: " + socket.handshake.query.name);
  person = {
    socketid: socket.id,
    name: socket.handshake.query.name,
    phone: socket.handshake.query.phone,
    permission: socket.handshake.query.permission
  };
  Listarr = [];
  request2dr = {
    addr: "",
    name: "",
    phone: "",
    requestid: "",
    socketid:""
  };
  if (socket.handshake.query.permission === "1") {
    console.log("User " + person.name + " Is connect");
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
    // console.log("mimi");
    console.log("response: ");
    console.log(resp);
    const driverInfo = {
      name: resp.name,
      driverphone: resp.driverphone,
      driverid: resp.driverid,
      requestid: resp.requestid,
    };
    if (resp.mess === "accept") {
      requestRepo
        .updateDriver(driverInfo.driverid, resp.requestid)
        .then(function() {
          requestRepo.updateState("waiting", resp.requestid);
          requestRepo.updateDriver(resp.driverid, resp.requestid);
        })
        .then( io.to(resp.socketid).emit(
          "server-send-response-user",
          driverInfo
        ));
      isBooked = true;
    }
    if (resp.mess === "reject") {
      if (Listarr.length > 1) {
        const dri = Listarr.filter((per, index) => {
          return per.socketid === socket.id;
        });
        Listarr.splice(Listarr.indexOf(dri[0]), 1);
        io.to(Listarr[0].socketid).emit(
          "server-send-request-driver",
          request2dr
        )
      }
        else {
          io.to(resp.socketid).emit(
            "server-send-response-user",
            driverInfo)
        };
      }
  });
  socket.on("user-send-place", function(data) {
    console.log(data);
    // console.log(serverData);
    if (arrayLocaIder.length > 0) {
      const index = Math.floor(Math.random() * arrayLocaIder.length + 0);
      /* arrayLocaIder.forEach(element => {
        io.to(element.socketid).emit("server-send-place-locate", serverData);
      });*/
      const request = {
        idUser: data.id,
        beginPlace: data.place,
        time: Date.now()
      };
      console.log("array kocate leng: " + arrayLocaIder.length);
      console.log(arrayLocaIder);
      requestRepo.addRequest(request).then(
        requestRepo.getRequestId(data.phone).then(row => {
          const serverData = {
            id: socket.id,
            data: data,
            requestid: row[0].id
          };
          io.to(arrayLocaIder[index].socketid).emit(
            "server-send-place-locate",
            serverData
          );
        })
      );
    } else {
      console.log("No location Identifier is on");
      //console.log(place);
    }
  });
  socket.on("locate-send-result", function(result) {
    request2dr = {
      addr: result.addr.addrCur,
      name: result.name,
      phone: result.phone,
      requestid: result.requestid,
      socketid: result.socketid
    };
    Listarr = arrayDriver; /*findListdriver(
      arrayDriver,
      result.addr.center.lat,
      result.addr.center.lng
    );*/
    requestRepo.updateState("Located", result.requestid);
    io.to(Listarr[0].socketid).emit("server-send-request-driver", request2dr);
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
  var p1 = lat1.toRadians();
  var p2 = lat2.toRadians();
  var dentalat = (lat2 - lat1).toRadians();
  var dentalon = (lon2 - lon1).toRadians();

  var a =
    Math.sin(dentalat / 2) * Math.sin(dentalat / 2) +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(dentalon / 2) *
      Math.sin(dentalon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function findListdriver(array, lat, lon, n) {
  return array;
}
