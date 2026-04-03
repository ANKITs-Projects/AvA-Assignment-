const express = require("express");
const cors = require("cors");
require("dotenv").config();

const uploadRoute = require("./routes/upload");
const analyticsRoute = require("./routes/analytics");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/analytics", analyticsRoute);

app.get("/", (req, res) => {
  res.json({ message: "Invoice AI Backend Running" });
});

module.exports = app;