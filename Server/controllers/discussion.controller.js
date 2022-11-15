const Discussion = require("../models/discussions.model");

exports.create = (req, res) => {
  let salt = Math.random().toString(36).substring(2, 15);
  var discussionId = req.body.questionId + req.body.rollNumber + salt;
  var arr = [];
  const discussion = new Discussion({
    questionId: req.body.questionId,
    discussionId: discussionId,
    message: req.body.message,
    rollNumber: req.body.rollNumber,
    likes: arr,
  });
  discussion
    .save()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send("Some Error occurred while posting Discussion");
    });
};

exports.likeUpdate = (req, res) => {
  var likesArr;
  var discussionId = req.body.discussionId;
  var rollNumber = req.body.rollNumber;
  Discussion.findOne({ discussionId: discussionId })
    .then((data) => {
      likesArr = data.likes;
      if (likesArr.includes(rollNumber)) {
        res.status(200).send(data);
      } else {
        likesArr.push(rollNumber);
        Discussion.findOneAndUpdate(
          { discussionId: discussionId },
          {
            $set: {
              likes: likesArr,
            },
          },
          { upsert: true }
        )
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            res
              .status(500)
              .send(
                "Error while updating Likes (After fetching the discussion)"
              );
          });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send(err.message || "Error Occurred while updating likes");
    });
};

exports.find = (req, res) => {
  Discussion.findOne({ discussionId: req.body.discussionId })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send("Error occurred while fetching discussion");
    });
};

exports.findAllQuestion = (req, res) => {
  Discussion.find({ questionId: req.params.questionId })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(data);
    });
};
