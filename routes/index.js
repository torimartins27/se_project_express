const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { NotFoundError } = require("../utils/NotFoundError");
const { validateUser, validateLogin } = require("../middlewares/validation");

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.post("/signin", validateLogin, login);
router.post("/signup", validateUser, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Page is not found"));
});

module.exports = router;
