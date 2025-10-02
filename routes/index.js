const router = require("express").Router();
const { NOTFOUND } = require("../utils/errors");

const userRouter = require("./users");
const clothingItems = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res) => {
  res.status(NOTFOUND).send({ message: "Requested resource not found" });
});
module.exports = router;
