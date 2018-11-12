var http = require("http").createServer();
var socketPort = process.env.PORT || 3002;
server = require("socket.io")(socketPort);
var io = server;
var arrayDriver = [];
var arrayLocaIder = [];
var arrayManager = [];

io.on("connection", function(socket) {
  console.log("user connect" + socket.id);
  socket.on("disconnect", function() {
    if (arrayDriver.length > 0) {
      if (arrayDriver.includes(soket.id)) {
        arrayDriver.pop(soket.id);
      }
    }
    if (arrayLocaIder.length > 0) {
      if (arrayLocaIder.includes(soket.id)) {
        arrayLocaIder.pop(soket.id);
      }
    }
    if (arrayManager.length > 0) {
      if (arrayManager.includes(soket.id)) {
        arrayManager.pop(soket.id);
      }
    }
  });
  socket.on("user-send-place", function(place) {
    if (arrayLocaIder.length > 0) {
      forEach(arrayLocaIder, function(element) {
        io.to(element).emit("server-send-place2", place);
      });
    } else {
      console.log("Error");
    }
  });
  socket.on("driver-login", function() {
    if (!arrayDriver.indexof(soket.id)) {
      arrayDriver.push(soket.id);
    }
  });
  socket.on("location-identifier-login", function() {
    if (!arrayLocaIder.indexof(soket.id)) {
      arrayDriver.push(soket.id);
    }
  });
  socket.on("Manager-login", function() {
    if (!arrayDriver.indexof(soket.id)) {
      arrayManager.push(soket.id);
    }
  });
});

console.log(`WS running on port ${socketPort}`);

module.exports = {
  io
};
