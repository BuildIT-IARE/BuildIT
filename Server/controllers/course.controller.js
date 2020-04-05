const Course = require("../models/course.model.js");

// Create and Save a new course
exports.create = (req, res) => {
  // Validate request
  if (!req.body.courseId) {
    return res.status(400).send({
      success: false,
      message: "CourseId can not be empty",
    });
  }

  if (!req.body.courseName) {
    return res.status(400).send({
      success: false,
      message: "Coursename can not be empty",
    });
  }

  // Create a course
  const course = new Course({
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    languageId: req.body.languageId,
  });

  // Savecourse in the database
  course
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while creating the Course.",
      });
    });
};

// Retrieve and return all courses from the database.
exports.findAll = (req, res) => {
  Course.find()
    .then((courses) => {
      res.send(courses);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving courses.",
      });
    });
};

// Find a single course with a courseId
exports.findOne = (req, res) => {
  Course.find({ courseId: req.params.courseId })
    .then((course) => {
      if (!course) {
        return res.status(404).send({
          success: false,
          message: "Course not found with id " + req.params.courseId,
        });
      }
      res.send(course);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Course not found with id " + req.params.courseId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error retrieving course with id " + req.params.courseId,
      });
    });
};

exports.findCourseLanguage = (req, callback) => {
  Course.find({ courseId: req.body.courseId })
    .then((course) => {
      if (!course) {
        return callback("Couldn't find course", null);
      }
      return callback(null, course);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return callback("Couldn't find course, caught exception", null);
      }
      return callback("Error retrieving data", null);
    });
};

// Update a course identified by the courseId in the request
exports.update = (req, res) => {
  if (!req.body.courseId) {
    return res.status(400).send({
      success: false,
      message: "content can not be empty",
    });
  }
  // Findcourse and update it with the request body
  Course.findOneAndUpdate(
    { courseId: req.body.courseId },
    {
      $set: {
        courseId: req.body.courseId,
        courseName: req.body.courseName,
      },
    },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log("Error Occured");
      }
    }
  )
    .then((course) => {
      if (!course) {
        return res.status(404).send({
          success: false,
          message: "Course not found with id " + req.body.courseId,
        });
      }
      res.send(course);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          success: false,
          message: "Course not found with id " + req.body.courseId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Error updating course with id " + req.body.courseId,
      });
    });
};

// Delete a course with the specified courseId in the request
exports.delete = (req, res) => {
  Course.findOneAndRemove({ courseId: req.params.courseId })
    .then((course) => {
      if (!course) {
        return res.status(404).send({
          success: false,
          message: "Course not found with id " + req.params.courseId,
        });
      }
      res.send({ message: "course deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          success: false,
          message: "Course not found with id " + req.params.courseId,
        });
      }
      return res.status(500).send({
        success: false,
        message: "Could not deleteCourse with id " + req.params.courseId,
      });
    });
};
