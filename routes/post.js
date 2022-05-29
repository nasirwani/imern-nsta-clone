/** @format */

const { urlencoded } = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { requireLogin } = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
//all posts details
router.get("/allpost", (req, res) => {
  Post.find({})
    .then((posts) => {
      console.log(posts);
      res.send({ posts });
    })
    .catch((e) => {
      console.log(e);
    });
});
//creating posts
router.post("/createpost", (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "please add all fields" });
  }
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBY: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((e) => {
      console.log(e);
    });
});
//all posts by signed user not working yet
router.get("/mypost", (req, res) => {
  Post.find({ _id: req.body._id })
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
