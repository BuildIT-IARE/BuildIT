let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const submissions = require('../controllers/submission.controller.js');

    // Create a new submission
    app.post('/submissions', submissions.create);

    // Retrieve submissions with contestId
    app.get('/submissions/:questionId', middleware.checkToken, submissions.findAll);

    // Retrieve submissions with userId
    app.get('/submissions/user/:username', middleware.checkToken,  submissions.findUser);
}