var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static("./app/view"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/actions', (req, res) => {
    console.log(req.body);
    io.emit('action', req.body);
});

io.on('connection', () =>{
    console.log('a user is connected')
  });
  
  
var server = http.listen(3001, () => {
console.log('server is running on port', server.address().port);
});


