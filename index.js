var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static("./app/view"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//rooms Namespace
const rooms = io.of('/rooms');

rooms.on('connection', (socket) =>{

    socket.on('join', (data) => {
        socket.join(data.room);
    });


    socket.on('event', (data) => {
        console.log(data);
        rooms.in(data.room).emit('action', data);
    });
});
  

  
var server = http.listen(3001, () => {
console.log('server is running on port', server.address().port);
});


