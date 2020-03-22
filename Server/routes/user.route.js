let middleware = require('../util/middleware.js');

module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new user
    app.post('/signup', users.create);

    // Retrieve all users
    app.get('/admin/users', middleware.checkTokenAdmin, users.findAll);

    // Retrieve a single user with userId
    app.get('/admin/users/:username', middleware.checkTokenAdmin, users.findOne);

    // Retrieve a single user with userId public
    app.get('/users/:username', middleware.checkToken, users.findOnePublic);

    // Login Route
    app.post('/login', users.checkPass);

    // Verify Route
    app.post('/verify', users.checkToken);

    // // Update a user with userId
    // app.put('/users', middleware.checkTokenAdmin, users.update);

    // Delete a user with userId
    app.delete('/users/:username', middleware.checkTokenAdmin, users.delete);

    // Forgot Password
    app.post('/forgotPass', users.forgotPass);
}