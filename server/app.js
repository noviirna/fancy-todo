require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const morgan = require("morgan");
const mongoose = require("mongoose");

const routes = require("./routes/index");
const errHandler = require("./helpers/errHandler");

if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "testing" ){
  const cors = require("cors");
  app.use(cors());
}

app.use(morgan("short"));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "2mb" }));

app.use("/", routes);
app.use(errHandler);

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(connected => {
    console.log("db connected");
  })
  .catch(errors => {
    console.log(JSON.stringify(errors, null, 2));
  });

if(process.env.NODE_ENV === "testing"){
  module.exports = app
} else {
  app.listen(port, () => { console.log("listen", port) });
}
  




