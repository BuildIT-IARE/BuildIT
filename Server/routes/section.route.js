let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const sections = require("../controllers/section.controller.js");

  // Create a new section
  app.post("/sections", middleware.checkTokenAdmin, sections.create);

  // Retrieve all sections
  app.get("/sections", middleware.checkToken, sections.findAll);

  // Retrieve all sections
  app.get("/sections/contest/:contestId", middleware.checkToken, sections.findAllContest);

  // Retrieve a single section with sectionId
  app.get("/sections/:sectionId", middleware.checkToken, sections.findOne);

  // Update a section with sectionId
  app.put("/sections", middleware.checkTokenAdmin, sections.update);

  // Delete a section with sectionId
  app.delete("/sections/:sectionId", middleware.checkTokenAdmin, sections.delete);
};
