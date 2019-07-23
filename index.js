var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const PORT = process.env.PORT || 8000

app.use(express.static("./app/view"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const MongoClient = require('mongodb').MongoClient;
const uri = process.env.url || require('./config/database.config').url;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  console.log("Connected");
  client.close();
});


app.get('/', function(request, response) {
    response.render(__dirname + '/app/view/playerPage/playerPage.html', {room : "room1"});
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


