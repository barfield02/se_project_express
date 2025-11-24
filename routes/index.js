const router = require("express").Router();
const { NOTFOUND } = require("../utils/errors");

const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const { createUser, login } = require("../controllers/user");

router.use("/users", userRouter);
router.use("/items", clothingItems);
router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res.status(NOTFOUND).send({ message: "Requested resource not found" });
});
module.exports = router;
