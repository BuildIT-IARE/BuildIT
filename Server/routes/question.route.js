module.exports = (app) => {
    const questions = require('../controllers/question.controller.js');

    // Create a new question
    app.post('/questions', questions.create);

    // Retrieve all questions
    app.get('/questions', questions.findAll);

    // Retrieve a single question with questionId
    app.get('/questions/:questionId', questions.findOne);

    // Update a question with questionId
    app.put('/questions/:questionId', questions.update);

    // Delete a question with questionId
    app.delete('/questions/:questionId', questions.delete);
}