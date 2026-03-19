require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");

const app = express();

const { requestLogger, errorLogger } = require("./middlewares/logger");

const centralizedErrorHandling = require("./middlewares/centralized-error-handling");

const { PORT = 3001 } = process.env;

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    autoIndex: true,
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);
app.use(express.json());
app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandling);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
