module.exports = (app) => {
  const counters = require("../controllers/counters.controller.js");

  app.post("/counters/add", counters.addDayCount);

  app.get("/counters", counters.getAllCounts);
};
