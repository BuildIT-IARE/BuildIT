let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const submissions = require('../controllers/submissionTut.controller.js');

    // Retrieve submissions with contestId
    app.get('/tsubmissions/:questionId', middleware.checkToken, submissions.findAll);

    // Retrieve submissions with userId
    app.get('/tsubmissions/user/:username/:questionId', middleware.checkToken,  submissions.findUser);
}