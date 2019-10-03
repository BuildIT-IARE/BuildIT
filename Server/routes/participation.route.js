let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const participation = require('../controllers/participation.controller.js');

    // Create a new participation
    app.post('/participations', middleware.checkToken, participation.create);

    // Retrieve all participations
    app.get('/participations', middleware.checkTokenAdmin, participation.findAll);

    // Retrieve all participations
    app.get('/participations/:contestId/:username', middleware.checkToken, participation.findUser);
}