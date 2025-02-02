const User = require("../models/user");
const { NOT_FOUND, DEFAULT, BAD_REQUEST } = require("../utils/constants");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT).send({ message: err.message });
    });
};

const findUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new Error("User not found"))
    .then((foundUser) => {
      res.status(200).send({ message: "ID found successfully", foundUser });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item ID not found" });
      }
      if (err.message === "User not found") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};

const createUsers = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item ID not found" });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};

module.exports = { getUsers, createUsers, findUser };
