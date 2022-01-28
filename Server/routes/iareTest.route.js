let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const iareTests = require("../controllers/iareTest.controller.js");

  // Create a new iareTest
  app.post("/iareTests", middleware.checkTokenAdmin, iareTests.create);

  // Retrieve all iareTests
  app.get("/iareTests", middleware.checkToken, iareTests.findAll);

  // Retrieve all iareSections of an iareTestId
  app.get("/iareTests/getIareSections/:iareTestId", middleware.checkToken, iareTests.findAllSections);

  // Retrieve a single iareTest with iareTestId
  app.get("/iareTests/:iareTestId", middleware.checkToken, iareTests.findOne);

  // Update a iareTest with iareTestId
  app.put("/iareTests", middleware.checkTokenAdmin, iareTests.update);

  // Delete a iareTest with iareTestId
  app.delete("/iareTests/:iareTestId", middleware.checkTokenAdmin, iareTests.delete);
};
