module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new user
    // app.post('/users', users.create);

    // Retrieve all users
    app.get('/users', users.findAll);

    // Retrieve a single user with userId
    app.get('/users/:username', users.findOne);

    // Update a user with userId
    // app.put('/users/:username', users.update);

    // Delete a user with userId
    // app.delete('/users/:username', users.delete);
}