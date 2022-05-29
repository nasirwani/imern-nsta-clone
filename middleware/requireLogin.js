/** @format */
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { jwtSecret } = require("../keys");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization, "auth");
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  //   const token = authorization.split("");
  console.log(token);
  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "you must be logged in first" });
    }
    const { _id } = payload;
    User.findById({ _id }).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
