module.exports = (app) => {
    const contests = require('../controllers/contest.controller.js');

    // Create a new contest
    app.post('/contests', contests.create);

    // Retrieve all contests
    app.get('/contests', contests.findAll);

    // Retrieve a single contest with contestId
    app.get('/contests/:contestId', contests.findOne);

    // Update a contest with contestId
    app.put('/contests/:contestId', contests.update);

    // Delete a contest with contestId
    app.delete('/contests/:contestId', contests.delete);
}