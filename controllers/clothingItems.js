const clothingItem = require("../models/clothingItem");
const { BadRequestError } = require("../utils/BadRequestError");
const { ServerError } = require("../utils/ServerError");
const { ForbiddenError } = require("../utils/ForbiddenError");
const { NotFoundError } = require("../utils/NotFoundError");

const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid input data"));
      }
      next(err);
    });
};

const getItem = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.send({ items }))
    .catch((err) => {
      console.error(err);
      next(
        new ServerError("An error occurred while retrieving clothing items")
      );
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findById(itemId)
    .orFail(new Error("Clothing item not found"))
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        throw new ForbiddenError("You are not the owner of this item");
      }
      return clothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        res.send({ message: "Item deleted successfully", deletedItem });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((likedItem) => {
      res.send({ message: "Item liked successfully", likedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      next(err);
    });
};

const unlikeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .orFail(() => new NotFoundError("Clothing item not found"))
    .then((likedItem) => {
      res.send({ message: "Item unliked successfully", likedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid clothing item ID"));
      }
      next(err);
    });
};

module.exports = { createItem, getItem, deleteItem, likeItem, unlikeItem };
