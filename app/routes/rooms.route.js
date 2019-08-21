module.exports = (app) => {
    const roomsController = require('../controllers/rooms.controller.js');

    app.post('/rooms/exists', roomsController.roomExists);

    app.post('/rooms/create', roomsController.createRoom);

    app.post('/rooms/delete', roomsController.deleteRoom);

    app.get('/rooms/:room_name', roomsController.loadRoom);

    app.get('/rooms', roomsController.getAllRooms);
}