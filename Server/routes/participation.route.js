module.exports = (app) => {
    const participation = require('../controllers/participation.controller.js');

    // Create a new participation
    app.post('/participation', participation.create);

    // Retrieve all participations
    app.get('/participations', participation.findAll);

}