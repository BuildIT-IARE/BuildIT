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
    "/admin/allocateVisitor/:personId",
    middleware.checkTokenAdmin,
    visitor.allocateVisitor
  );
  
  app.get(
    "/admin/deallocateVisitor/:personId",
    middleware.checkTokenAdmin,
    visitor.deallocateVisitor
  );

  app.get("/getVisitorData/:personId", visitor.findOne);
};
