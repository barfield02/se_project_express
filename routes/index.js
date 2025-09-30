const router = require("express").Router();

const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const itemsRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItems);
router.use("/items", itemsRouter);

module.exports = router;
