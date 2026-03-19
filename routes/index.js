const router = require("express").Router();

const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const { createUser, login } = require("../controllers/user");
const NotFoundError = require("../errors/not-found-err");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItems);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateAuthentication, login);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});
module.exports = router;
