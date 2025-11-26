const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BADREQUEST,
  INTERNALERROR,
  NOTFOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    res.status(BADREQUEST).send({
      message: "The email and password is required",
    });
    return;
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash }).then((user) => {
        // Remove password from response for security
        const { password: hashedPassword, ...userWithoutPassword } =
          user.toObject();
        res.status(201).send({ data: userWithoutPassword });
      });
    })

    .catch((err) => {
      console.error(err);

      // Handle duplicate email error (MongoDB error code 11000)
      if (err.code === 11000) {
        return res.status(CONFLICT).send({
          message: "User with this email already exists",
        });
      }

      // Handle validation errors
      if (err.name === "ValidationError") {
        return res.status(BADREQUEST).send({
          message: "Invalid data provided",
        });
      }

      // Handle other server errors
      return res.status(INTERNALERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

const getUser = (req, res) => {
  const userId = req.user._id;
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

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOTFOUND).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(BADREQUEST).send({ message: "Invaild data" });
      }
      return res
        .status(INTERNALERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(BADREQUEST).send({
      message: "The email and password is required",
    });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch(() => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "The email or password is incorrect" });
      }
      return res.status(INTERNALERROR);
    });
};
module.exports = { createUser, getUser, login, updateUser };
