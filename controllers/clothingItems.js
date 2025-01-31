const clothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, imageURL, weather } = req.body;
  clothingItem
    .create({ name, weather, imageURL, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ item });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ message: err.message });
    });
};

const getItem = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send({ items }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndDelete(itemId)
    .orFail(new Error("Clothing item not found"))
    .then((deletedItem) => {
      res
        .status(200)
        .send({ message: "Item deleted successfully", deletedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Clothing item not found") {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(new Error("Clothing item not found"))
    .then((likedItem) => {
      res.status(200).send({ message: "Item liked successfully", likedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Clothing item not found") {
        return res.staus(404).send({ message: "Clothing item not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

const unlikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.params._id } },
      { new: true }
    )
    .orFail(new Error("Clothing item not found"))
    .then((likedItem) => {
      res.status(200).send({ message: "Item unliked successfully", likedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Clothing item not found") {
        return res.staus(404).send({ message: "Clothing item not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { createItem, getItem, deleteItem, likeItem, unlikeItem };
