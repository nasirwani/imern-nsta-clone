/** @format */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../keys");
const requireLogin = require("../middleware/requireLogin");
const mongoose = require("mongoose");
const User = mongoose.model("User");
//login middle not working
router.get("/verifyToken", requireLogin, (req, res) => {
  res.send("Hello your token is sucessfully verified");
});
//register
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all fields" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "user already exists with that email" });
    }
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        user
          .save()
          .then(() => {
            res.json({ message: "saved sucessfully" });
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  });
});

//login
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please enter email or password" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "invalid email or password" });
      } else {
        bcrypt
          .compare(password, savedUser.password)
          .then((doWatch) => {
            if (doWatch) {
              //   res.status(200).json({ message: "login sucessfull" });
              const token = jwt.sign({ _id: savedUser._id }, jwtSecret);
              res.json({ token: token });
              console.log(token);
            } else {
              return res
                .status(422)
                .json({ error: "invalid email or password" });
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    })
    .catch((e) => {
      console.log(e);
    });
});
module.exports = router;
