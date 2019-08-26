const mongoose = require('mongoose');

const roomsSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        dropDups: true
    },
    videos : [String],
    video : String
},{
    // Mongoose automatically adds createdAt and updatedAt in the schema
    timestamps : true   
});

module.exports = mongoose.model('roomsModel', roomsSchema);