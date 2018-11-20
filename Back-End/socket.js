var http = require("http").createServer();
var socketPort = process.env.PORT || 3002;
server = require("socket.io")(socketPort);
var io = server;
var arrayDriver = [];
var arrayLocaIder = [];
var arrayManager = [];
const numberDriver = 5;
var person = {
  socketid: "",
  name: "",
  phone: ""
};
io.on("connection", function(socket) {
  person.socketid = socket.id;
  person.name = socket.handshake.query.name;
  person.phone = socket.handshake.query.phone;
  console.log(socket.id);
  console.log(socket.handshake.query.permission);
  if (socket.handshake.query.permission === "1") {
    console.log("User " + person.name + " Is connect");
  } else {
    if (socket.handshake.query.permission === "2") {
      console.log("Location Identifier " + person.name + " Is connect");
      pushNewConnect(arrayLocaIder,person,socket.id);
    } else {
      if (socket.handshake.query.permission === "3") {
        console.log("Manager " + socket.handshake.query.name + " Is connect");
        pushNewConnect(arrayManager,person,socket.id);
      } else {
        if (socket.handshake.query.permission === "4") {
          console.log("Driver " + socket.handshake.query.name + " Is connect");
          pushNewConnect(arrayDriver,person,socket.id);
        }
      }
    }
  }
  socket.on("user-send-place", function(place) {
    const serverData = {
      id : socket.id,
      place: place,
      name: person.name,
      phone: person.phone
    }
    console.log(serverData);
    if (arrayLocaIder.length > 0) {
      arrayLocaIder.forEach(element => {
        io.to(element.socketid).emit("server-send-place-locate", serverData);
      });
    } else {
      console.log("No location Identifier is on");
      //console.log(place);
    }
  });
  socket.on("locate-send-result", function(result) {
    console.log(result);
    const request={
      addr: result.addr.addrCur,
      name: result.name,
      phone: result.phone
    }
    console.log(request);
    var Listarr = findListdriver(arrayDriver,result.addr.center.lat,result.addr.center.lng);
    var isBooked = false;
    /*for( let i =0; i < arrayDriver.length;)
    {
      io.to(arrayDriver[i].socketid).emit("server-send-request-driver",request);
      socket.on("driver-send-response", function(resp){
        if(resp === "accept")
        {
          i = arrayDriver.length;
          isBooked= true;
          const driverInfo={
            name: element.name,
            phone: element.phone
          }
          socket.emit("server-send-user-driver",driverInfo);
          isBooked = true;
        }
        else{
          i++;
        }
      });
    }*/
    if(isBooked === false)
    {
      socket.emit("server-send-user-driver","Requset Fail");
    }
  });
  socket.on("locate-send-place", function(place)
  {

  });
  socket.on("disconnect", function() {});
});

console.log(`WS running on port ${socketPort}`);

module.exports = {
  io
};

function pushNewConnect(array, person, socketid)
{
  if (array.includes(person) === false) {
    array.push(person);
  } else {
    if (array[array.indexOf(person)].socketid !== socketid) {
      array[array.indexOf(person)].socketid = socketid;
    }
  }
}
function distanceWithHaversin(lat1, lon1 ,lat2, lon2)
{	
var R = 6371e3; // metres
var p1 = lat1.toRadians();
var p2 = lat2.toRadians();
var  dentalat = (lat2-lat1).toRadians();
var  dentalon = (lon2-lon1).toRadians();

var a = Math.sin(dentalat/2) * Math.sin(dentalat/2) +
        Math.cos(p1) * Math.cos(p2) *
        Math.sin(dentalon/2) * Math.sin(dentalon/2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

return R*c;
}

function findListdriver(array , lat, lon, n)
{

}