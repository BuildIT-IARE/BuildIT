let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const iareTests = require("../controllers/iareTest.controller.js");

  // Create a new iareTest
  app.post("/iare_tests", middleware.checkTokenAdmin, iareTests.create);

  // Retrieve all iareTests
  app.get("/iare_tests", middleware.checkToken, iareTests.findAll);

  // Retrieve a single iareTest with iareTestId
  app.get("/iare_tests/:testId", middleware.checkToken, iareTests.findOne);

  // Update a iareTest with iareTestId
  app.put("/iare_tests", middleware.checkTokenAdmin, iareTests.update);

  // Delete a iareTest with iareTestId
  app.delete("/iare_tests/:testId", middleware.checkTokenAdmin, iareTests.delete);
};
