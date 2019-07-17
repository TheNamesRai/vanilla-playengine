var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 8000

app.use(express.static("./app/view"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', function(request, response) {
    response.sendFile(__dirname + '/app/view/playerPage/playerPage.html');
})

//rooms Namespace
const rooms = io.of('/rooms');

rooms.on('connection', (socket) =>{

    socket.on('join', (data) => {
        console.log("Joined " + data.room);
        socket.join(data.room);
    });


    socket.on('event', (data) => {
        console.log(data);
        rooms.in(data.room).emit('action', data);
    });
});
  

  
var server = http.listen(PORT, () => {
console.log('server is running on port', server.address().port);
});


