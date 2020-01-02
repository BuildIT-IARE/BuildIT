import Course from '../models/course.model.js';

// Create and Save a new course
exports.create = (req, res) => {
    // Validate request
    if(!req.body.courseId) {
        return res.status(400).send({
            success: false,
            message: "CourseId can not be empty"
        });
    }

    if(!req.body.courseName) {
        return res.status(400).send({
            success: false,
            message: "Coursename can not be empty"
        });
    }

    // Create a course
    const course = new Course({
        courseId: req.body.courseId,
        courseName: req.body.courseName
      });

    // Savecourse in the database
    course.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: err.message || "Some error occurred while creating the Course."
        });
    });
};

// Retrieve and return all courses from the database.
exports.findAll = (req, res) => {
    Course.find()
    .then(courses => {
        res.send(courses);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving courses."
        });
    });
};

