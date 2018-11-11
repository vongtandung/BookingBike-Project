var http = require('http').createServer();
var socketPort = process.env.PORT || 3002;
server = require('socket.io')(socketPort);
var io = server;

   

io.on('connection', function(socket){
        console.log('user connect'+ socket.id);
        socket.on('disconnect', function(){
            console.log('user disconnected');
          });
    });

    console.log(`WS running on port ${socketPort}`);



module.exports = {
    io
}