let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const courses = require("../controllers/course.controller.js");

  // Create a new course
  app.post("/courses", middleware.checkTokenAdmin, courses.create);

  // Retrieve all courses
  app.get("/courses", middleware.checkToken, courses.findAll);

  // Retrieve a single course with courseId
  app.get("/courses/:courseId", middleware.checkToken, courses.findOne);

  // Update a course with courseId
  app.put("/courses", middleware.checkTokenAdmin, courses.update);

  // Delete a course with courseId
  app.delete("/courses/:courseId", middleware.checkTokenAdmin, courses.delete);
};
