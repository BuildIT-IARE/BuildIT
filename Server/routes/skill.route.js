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
    skills.findAll
  );
  
  // Retrieve a single week with weekId
  app.get(
    "/skill",
    skills.findRecent
  );

  // Retrieve a single week with last weekId
  app.get(
    "/skill/:week",
    skills.findOne
  );
  
  // Retrieve all weeks
  app.get(
    "/weeks",
    skills.findAllWeeks
  );

  // Retrieve a skill with Username
  app.get(
    "/skills/:username",
    skills.findSkillByUsername
  );
};
