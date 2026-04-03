const dotenv = require('dotenv')
dotenv.config();
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const uploadRoute = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);

app.get("/", (req, res) => {
  res.json({ message: "Invoice AI Backend Running" });
});

module.exports = app;