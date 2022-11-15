let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const Discussion = require("../controllers/discussion.controller");

  app.post("/discussionPost", Discussion.create);
  app.post("/liked", Discussion.likeUpdate);
  app.get("/discussionGet", Discussion.find);
  app.get("/discussions/:questionId", Discussion.findAllQuestion);
};
