var http = require('http').createServer();
var socketPort = process.env.PORT || 3002;
server = require('socket.io')(socketPort);
var io = server;
var arrayDriver= [];
var arrayLocaIder= [];
var arrayManager =[]; 

io.on('connection', function(socket){
        console.log('user connect'+ socket.id);
        socket.on('disconnect', function(){
            if(arrayDriver.indexof(soket.id))
            {
                arrayDriver.pop(soket.id);
            }
            if(arrayLocaIder.indexof(soket.id))
            {
                arrayLocaIder.pop(soket.id);
            }
            if(arrayManager.indexof(soket.id))
            {
                arrayManager.pop(soket.id);
            }
          });
        socket.on("client-send-place",function(place){
            console.log(place)
        })
        socket.on("driver-login",function(){
            if(!arrayDriver.indexof(soket.id))
            {
                arrayDriver.push(soket.id);
            }
        })
        socket.on("location-identifier-login",function(){
            if(!arrayLocaIder.indexof(soket.id))
            {
                arrayDriver.push(soket.id);
            }
        })
        socket.on("Manager-login",function(){
            if(!arrayDriver.indexof(soket.id))
            {
                arrayManager.push(soket.id);
            }
        })
    });

    console.log(`WS running on port ${socketPort}`);



module.exports = {
    io
}