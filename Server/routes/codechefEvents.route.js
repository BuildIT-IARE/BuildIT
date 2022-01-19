let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const codechefEvents = require("../controllers/codechefEvents.controller.js");

  app.get("/codechef-events", codechefEvents.findAll);

  app.post("/codechef-events", middleware.checkToken, codechefEvents.create);
};
