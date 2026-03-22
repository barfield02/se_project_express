const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const {
  BADREQUEST,
  INTERNALERROR,
  NOTFOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const NotFoundError = require("../errors/not-found-err");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name, avatar, email, password: hash }).then((user) => {
        // Remove password from response for security
        const { password: hashedPassword, ...userWithoutPassword } =
          user.toObject();
        res.status(201).send({ data: userWithoutPassword });
      })
    )

    .catch((err) => {
      console.error(err);

      // Handle duplicate email error (MongoDB error code 11000)
      if (err.code === 11000) {
        return next(new ConflictError("An error has occurred on the server"));
      }

      // Handle validation errors
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }

      // Handle other server errors
      return next(err);
    });
};

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("getUser failed"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("getUser failed"));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
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
        return next(new NotFoundError("user not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("The email and password is required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(
          new UnauthorizedError("The email or password is incorrect")
        );
      }
      return next(err);
    });
};
module.exports = { createUser, getUser, login, updateUser };
