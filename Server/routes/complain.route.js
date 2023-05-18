let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const complains = require("../controllers/complain.controller.js");

  // Create a new complain
  app.post("/complains", middleware.checkToken, complains.create);

  // Retrieve all complains
  app.get("/complains", middleware.checkToken, complains.findAll);

  app.get("/complains/:complainId", middleware.checkToken, complains.findOne);

  app.delete(
    "/complains/:complainId",
    middleware.checkTokenAdmin,
    complains.delete
  );

  app.put(
    "/complains/:complainId",
    middleware.checkTokenAdmin,
    complains.update
  )
};
