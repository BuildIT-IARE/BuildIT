let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const complains = require("../controllers/complain.controller.js");

  // Create a new complain
  app.post("/complains", middleware.checkToken, complains.create);

  // Retrieve all complains
  app.get("/complains", middleware.checkToken, complains.findAll);

  app.delete(
    "/complains/:questionId",
    middleware.checkTokenAdmin,
    complains.delete
  );
};
