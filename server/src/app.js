import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./routes/upload.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);

app.get("/", (req, res) => {
  res.json({ message: "Invoice AI Node Backend Running" });
});

export default app;