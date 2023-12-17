let middleware = require("../util/middleware.js");

const facultyDetailsController = require("../controllers/facultyDetails.controller.js");

module.exports = (app) => {

    // access routes

    app.get("/checkPage", middleware.checkTokenAdmin, facultyDetailsController.checkServePage );

    // get one route 
    app.get("/facultyDashboard/:id", middleware.checkTokenAdmin,facultyDetailsController.getOne);

    // get all route
    app.get("/facultyDashboard", middleware.checkTokenAdmin,facultyDetailsController.getAll);


    // create item route
    app.post("/facultyDashboard", middleware.checkTokenAdmin, facultyDetailsController.createItem);
    
    // delete item route 
    app.delete("/facultyDashboard/:id", middleware.checkTokenAdmin,facultyDetailsController.deleteItem);

    // update item route 
    app.put("/facultyDashboard/:id",middleware.checkTokenAdmin, facultyDetailsController.updateItem);

};