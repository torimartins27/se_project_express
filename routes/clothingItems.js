// clothingItemRouter.js
const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

router.get("/", getItem);

router.use(auth);

router.post("/", validateClothingItem, createItem);

router.delete("/:itemId", validateId, deleteItem);

router.put("/:itemId/likes", validateId, likeItem);

router.delete("/:itemId/likes", validateId, unlikeItem);

module.exports = router;
