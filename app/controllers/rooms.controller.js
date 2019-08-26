var roomsModel = require('../models/rooms.model.js');


exports.roomExists = (req, res) => {
    console.log("------roomExists entry------");
    roomsModel.findOne({ name : req.body.room_name} , (err, room) => {
        if(err || !room) {
            console.log('------roomExists exit false------');
            res.send({
                roomExists : false
            });
        }
        else{
            console.log('------roomExists exit true------');
            res.send({
                roomExists : true
            });
        }
    });
};

exports.createRoom = (req, res) => {
    const room = new roomsModel({
        name : req.body.room_name,
        video : "",
        videos: []
    });

    room.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the room"
        });
    });
};

exports.deleteRoom = (req,res) => {
    roomsModel.remove({name : req.body.room_name}, (err) => {
        if(err){
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "room not found with id " + req.body.room_name
                });                
            }
            return res.status(500).send({
                message: "Could not delete room with id " + req.body.room_name
            });
        }
        res.send({message: req.body.room_name + ": room deleted successfully!"});
    });
}

exports.loadRoom = (req, res) => {
    roomsModel.findOne({ name : req.params.room_name} , (err, roomObj) => {
        if(err || !roomObj) {
            res.send({
                msg : "Room doesn't exist"
            });
        }
        else{
            var directoryPath = __dirname;
            var n = directoryPath.lastIndexOf('/');
            directoryPath = directoryPath.slice(0,n);
            res.render('PlayerPage/playerPage.html', {err : "", data : {videos : roomObj.videos, video: roomObj.video}, room : req.params.room_name});
        }
    });
    
};

exports.getAllRooms = (req, res) => {
    roomsModel.find()
    .then(rooms => {
        res.send(rooms);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving rooms."
        });
    });
};

exports.addVideo = (room_name, videoId) => {
    function cb(){
        console.log("Successfully added " + videoId + " in room : " + room_name);
    }
    roomsModel.updateOne({name : room_name}, { $push: {videos : videoId}}).exec(cb);
};

exports.deleteVideo = (room_name, videoId) => {
    //videoId = "https://www.youtube.com/watch?v=" + videoId;
    console.log(room_name + " : " + videoId);
    roomsModel.updateOne({name : room_name}, {$pull: {videos : videoId }}, function(err, data){
        if(err){
            console.log("error : " + err);
        }
        if(data){
            console.log("data : " + JSON.stringify(data) );
        }
    });
};

exports.updateVideo = (room_name, videoId) => {
    roomsModel.updateOne({name : room_name}, { $set: { video : videoId}}, function(err, data){
        if(err){
            console.log("error : " + err);
        }
        if(data){
            console.log("data : " + JSON.stringify(data) );
        }
    });
}
