const User = require("../models/user");
const { BADREQUEST, INTERNALERROR, NOTFOUND } = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BADREQUEST).send({ message: "User created failed" });
      }
      return res.status(INTERNALERROR).send({ message: "User created failed" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOTFOUND).send({ message: "getUser failed" });
      }
      if (err.name === "CastError") {
        return res.status(BADREQUEST).send({ message: "getUser failed" });
      }
      return res.status(INTERNALERROR).send({ message: "getUser failed" });
    });
};

module.exports = { createUser, getUser };
