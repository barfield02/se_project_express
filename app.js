require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const app = express();
const { errors } = require("celebrate");
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

app.use(requestLogger);
app.use(express.json());
app.use("/", mainRouter);

app.use(errorLogger);
app.use(errorHandler);
app.use(errors());
app.use(centralizedErrorHandling);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
