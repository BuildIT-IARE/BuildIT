let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const contests = require('../controllers/contest.controller.js');

    // Create a new contest
    app.post('/contests', middleware.checkTokenAdmin, contests.create);
    
    // Publish Question
    app.post('/contests/:contestId/publish', middleware.checkTokenAdmin, contests.publish);

    // Archive Question
    app.post('/contests/:contestId/archive', middleware.checkTokenAdmin, contests.archive);

    // Retrieve all contests
    app.get('/contests', middleware.checkToken, contests.findAll);

    // Retrieve a single contest with contestId
    app.get('/contests/:contestId', middleware.checkToken, contests.findOne);

    // Update a contest with contestId
    app.put('/contests/:contestId', middleware.checkTokenAdmin, contests.update);

    // Delete a contest with contestId
    app.delete('/contests/:contestId', middleware.checkTokenAdmin, contests.delete);
}