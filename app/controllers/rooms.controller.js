var roomsModel = require('../models/rooms.model.js');


exports.roomExists = (req, res) => {
    roomsModel.findOne({ name : req.body.room_name} , (err, room) => {
        if(err || !room) {
            res.send({
                roomExists : false
            });
        }
        else{
            res.send({
                roomExists : true
            });
        }
    });
};

exports.createRoom = (req, res) => {
    const room = new roomsModel({
        name : req.body.room_name,
        video : -1,
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
    console.log(req.params.room_name);
    roomsModel.findOne({ name : req.params.room_name} , (err, roomObj) => {
        if(err || !roomObj) {
            res.send({
                msg : "Room doesn't exist"
            });
        }
        else{
            console.log(JSON.stringify(roomObj));
            res.render(__dirname + '/../view/PlayerPage/playerPage.html', {err : "", data : {videos : roomObj.videos, video: roomObj.video}, room : req.params.room_name});
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