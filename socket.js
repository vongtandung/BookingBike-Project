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
    id: socket.handshake.query.id,
    permission: socket.handshake.query.permission
  };
  Listarr = [];
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
    if (resp.mess === "accept") {
     
        io.to(resp.socketid).emit(
          "server-send-response-user",
          requestid
        );
    }
    if (resp.mess === "reject") {
      if (Listarr.length > 1) {
        const dri = Listarr.filter((per, index) => {
          return per.socketid === socket.id;
        });
        Listarr.splice(Listarr.indexOf(dri[0]), 1);
        io.to(Listarr[0].socketid).emit(
          "server-send-request-driver",
          resp.requestid
        )
      }
        else {
          
        };
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
    ele = arrayDriver.filter((per, index) => {
      return per.id === socket.handshake.query.id;
    });
    io.to(ele[0].socketid).emit("server-send-request-driver", requestid);
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

