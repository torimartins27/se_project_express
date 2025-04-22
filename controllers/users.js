const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BadRequestError } = require("../utils/BadRequestError");
const { NotFoundError } = require("../utils/NotFoundError");
const { UnauthorizedError } = require("../utils/UnauthorizedError");
const { ConflictError } = require("../utils/ConflictError");
const { ServerError } = require("../utils/ServerError");

const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(new Error("User not found"))
    .then((foundUser) => {
      res.send({ message: "ID found successfully", foundUser });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err);
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();
      res.send({ user: userWithoutPassword });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return next(new ConflictError("Email already in use"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(err);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Incorrect email or password provided"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError(err.message));
      }
      return next(err);
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFoundError("User not found"));
      }
      return res.send({ user: updatedUser });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
