let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const iareTestSections = require("../controllers/iareTestSection.controller.js");

  // Create a new iareTestSection
  app.post("/iareTestSections", middleware.checkTokenAdmin, iareTestSections.create);

  // Retrieve all iareTestSections
  app.get("/iareTestSections", middleware.checkToken, iareTestSections.findAll);

  // Retrieve a single iareTestSection with iareTestSectionId
  app.get("/iareTestSections/:iareTestSectionId", middleware.checkToken, iareTestSections.findOne);

  // Update a iareTestSection with iareTestSectionId
  app.put("/iareTestSections", middleware.checkTokenAdmin, iareTestSections.update);

  // Delete a iareTestSection with iareTestSectionId
  app.delete("/iareTestSections/:iareTestSectionId", middleware.checkTokenAdmin, iareTestSections.delete);
};
