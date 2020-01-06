let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const questions = require('../controllers/questionTut.controller.js');

    // Create a new question
    app.post('/tquestions', middleware.checkTokenAdmin, questions.create);

    // Retrieve all questions
    app.get('/tquestions', middleware.checkTokenAdmin, questions.findAll);

    // Retrieve a single question with questionId
    app.get('/tquestions/:questionId', middleware.checkToken, questions.findOne);

    // Retrieve all questions with courseId
    app.get('/tquestions/courses/:courseId', middleware.checkToken, questions.findAllCourse);

    // Update a question with questionId
    app.put('/tquestions/:questionId', middleware.checkTokenAdmin, questions.update);

    // Delete a question with questionId
    app.delete('/tquestions/:questionId', middleware.checkTokenAdmin, questions.delete);
}