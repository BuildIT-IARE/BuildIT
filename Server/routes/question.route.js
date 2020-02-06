let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const questions = require('../controllers/question.controller.js');

    // Create a new question
    app.post('/questions', middleware.checkTokenAdmin, questions.create);

    // Retrieve all questions
    app.get('/questions', middleware.checkTokenAdmin, questions.findAll);

    // Retrieve a single question with questionId
    app.get('/questions/:questionId', middleware.checkToken, questions.findOne);

    // Retrieve all questions with contestId
    app.get('/questions/contests/:contestId', middleware.checkToken, questions.findAllContest);

    // Retrieve all questions with courseId
    app.get('/questions/courses/:courseId', middleware.checkToken, questions.findAllCourse);

    // Update a question with questionId
    app.put('/questions/:questionId', middleware.checkTokenAdmin, questions.update);

    // Delete a question with questionId
    app.delete('/questions/:questionId', middleware.checkTokenAdmin, questions.delete);

    // Create a new question
    app.post('/questions/mergeCourse', middleware.checkTokenAdmin, questions.merge);
}