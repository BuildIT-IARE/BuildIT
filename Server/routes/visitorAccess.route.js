let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const visitor = require("../controllers/visitorAccess.controller.js");

  app.post("/newVisitor", visitor.create);

  app.get("/findOneVisitor/:phoneNumber", visitor.findOnePhone);

  app.get("/admin/getVisitorData", middleware.checkTokenWatch, visitor.findAll);
  //delete visitor
  app.get(
    "/admin/deleteVisitor/:personId",
    middleware.checkTokenWatch,
    visitor.deleteVisitor
  );

  app.get(
    "/admin/deallocateVisitor/:personId",
    middleware.checkTokenWatch,
    visitor.deallocateVisitor
  );

  app.get("/getVisitorData/:personId", visitor.findOne);

  app.get(
    "/admin/getAllocateData",
    middleware.checkTokenWatch,
    visitor.getAllocateData
  );

  app.get(
    "/admin/viewPass/:personId",
    middleware.checkTokenWatch,
    visitor.adminViewPass
  );
};
