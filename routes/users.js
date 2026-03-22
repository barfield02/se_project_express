const router = require("express").Router();
const { getUser, updateUser } = require("../controllers/user");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

router.use(auth);
router.get("/me", getUser);
router.patch("/me", validateUserUpdate, updateUser);
module.exports = router;
