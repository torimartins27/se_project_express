const router = require("express").Router();
const { getUsers, findUser, createUsers } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", findUser);

router.post("/", createUsers);

module.exports = router;
