let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const skills = require("../controllers/skill.controller.js");
  
  // Create a new skill using Excel
  app.post(
    "/skillExcel",
    middleware.checkTokenAdmin,
    skills.createExcel
  );
 
  // Retrieve all skill
  app.get(
    "/skills",
    middleware.checkTokenAdmin,
    skills.findAll
  );
  
  // Retrieve a single week with weekId
  app.get(
    "/skill",
    middleware.checkToken,
    skills.findRecent
  );

  // Retrieve a single week with last weekId
  app.get(
    "/skill/:week",
    middleware.checkToken,
    skills.findOne
  );
  
  // Retrieve all weeks
  app.get(
    "/weeks",
    middleware.checkTokenAdmin,
    skills.findAllWeeks
  );
};
