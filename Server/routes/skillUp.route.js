let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const skillUp = require("../controllers/skillUp.controller.js");
  // Create a new skillup ac
  app.post("/skillUp", middleware.checkToken, skillUp.create);
  //get all skillUps
  app.get("/skillUps", middleware.checkTokenAdmin, skillUp.findAllSkillUps);
  //update skillUp details
  app.post(
    "/skillUp/update/details",
    middleware.checkToken,
    skillUp.updateDetails
  );
  //
  app.post(
    "/skillUp/update/:rollNumber/:leetCodeId/:hackerRankId/:codeChefId/:codeForcesId/:interviewBitId/:spojId/:geeksForGeeksId",
    middleware.checkToken,
    skillUp.update
  );
};
