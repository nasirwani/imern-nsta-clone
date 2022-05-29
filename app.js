/** @format */

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
// require("./models/users");
// app.use(express.json());
// app.use(require("./routes/auth"));
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
// mongoose.connect("MONGGOURI");
const connectionParams = {
  useNewUrlParser: true,
  //   useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose
  .connect(MONGOURI, connectionParams)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("error", err);
  });
require("./models/users");
require("./models/post");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.listen(port, () => {
  console.log("working on port", port);
});
