const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
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
      if (err.message === "User not found") {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(500).send({ message: err.message });
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
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, createUsers, findUser };
