let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  // Create a new user
  app.post("/signup", users.create);

  // Retrieve all users
  app.get("/admin/users", middleware.checkTokenAdmin, users.findAll);

  // Retrieve a single user with userId
  app.get("/admin/users/:username", middleware.checkTokenAdmin, users.findOne);

  // Retrieve a single user with userId public
  app.get("/users/:username", middleware.checkToken, users.findOnePublic);

  // Retrieve a single user with userId public
  app.get("/users/branch/:username", users.findBranch);

  app.get("/generateSecret", middleware.checkToken, users.generateSecret);
  // Login Route
  app.post("/login", users.checkPass);

  // Verify Route
  app.post("/verify", users.checkToken);

  // // Update a user with userId
  // app.put('/users', middleware.checkTokenAdmin, users.update);

  // Update user info
  app.post("/users/:username", middleware.checkToken, users.updateOne);

  // Update Photo
  app.post("/users/photo/:username", middleware.checkToken, users.updateImage);

  // Delete a user with userId
  app.delete("/users/:username", middleware.checkTokenAdmin, users.delete);

  // Delete Multiple users
  app.post(
    "/users/delete/multiple",
    middleware.checkTokenAdmin,
    users.deleteMultiple
  );

  // Forgot Password
  app.post("/forgotPass", users.forgotPass);

  app.post("/updatePassword", users.updatePassword);

  app.post('/createUsers',users.createUsers)
};
