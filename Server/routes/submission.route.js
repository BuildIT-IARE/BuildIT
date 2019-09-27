module.exports = (app) => {
    const submissions = require('../controllers/submission.controller.js');

    // Create a new submission
    app.post('/submissions', submissions.create);

    // Retrieve submissions with contestId
    app.get('/submissions/:questionId', submissions.findAll);

    // Retrieve submissions with userId
    app.get('/submissions/user/:username', submissions.findUser);
}