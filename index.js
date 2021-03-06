var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require("path");
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 8000

app.use(express.static(path.join(__dirname + "/app/view")));
app.set('views', path.join(__dirname, '/app/view'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const uri = process.env.url || require('./config/database.config').url;
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(uri, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


app.get('/', function(request, response) {
    console.log(__dirname + '/app/view/welcomePage/welcomePage.html');
    response.render(__dirname + '/app/view/welcomePage/welcomePage.html', {err : ""});
});

// all routes for the portfolio apis
require('./app/routes/rooms.route.js')(app);


//rooms Namespace
const rooms = io.of('/rooms');

rooms.on('connection', (socket) =>{

    var roomController = require('./app/controllers/rooms.controller.js');
    socket.on('join', (data) => {
        console.log("Joined " + data.room);
        socket.join(data.room);
    });

    socket.on('event', (data) => {
        console.log(data);
        if (data.action === 'ADD_VIDEO'){
            roomController.addVideo(data.room, data.videoId);
        }
        else if(data.action === 'REMOVE_VIDEO'){
            roomController.deleteVideo(data.room, data.videoId);
        }
        else if(data.action === 'LOAD_NEW_VIDEO'){
            roomController.updateVideo(data.room, data.videoId)
        }
        rooms.in(data.room).emit('action', data);
    });
});
  

  
var server = http.listen(PORT, () => {
console.log('server is running on port', server.address().port);
});


