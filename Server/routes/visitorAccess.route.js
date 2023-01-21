let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const visitor = require("../controllers/visitorAccess.controller.js");

  app.post("/newVisitor", visitor.create);

  app.get("/admin/getVisitorData", middleware.checkTokenAdmin, visitor.findAll);
  //delete visitor
  app.get(
    "/admin/deleteVisitor/:personId",
    middleware.checkTokenAdmin,
    visitor.deleteVisitor
  );

  app.get(
    "/admin/deallocateVisitor/:personId",
    middleware.checkTokenAdmin,
    visitor.deallocateVisitor
  );

  app.get("/getVisitorData/:personId", visitor.findOne);

  app.get(
    "/admin/getAllocateData",
    middleware.checkTokenAdmin,
    visitor.getAllocateData
  );

  app.get(
    "/admin/viewPass/:personId",
    middleware.checkTokenAdmin,
    visitor.adminViewPass
  );
};
