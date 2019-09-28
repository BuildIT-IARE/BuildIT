let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const participation = require('../controllers/participation.controller.js');

    // Create a new participation
    app.post('/participation', middleware.checkToken, participation.create);

    // Retrieve all participations
    app.get('/participations', middleware.checkTokenAdmin, participation.findAll);

    // Update Participation
    app.post('/participations/update', participation.acceptSubmission);
}