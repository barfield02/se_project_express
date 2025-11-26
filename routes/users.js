const router = require("express").Router();
const { getUser, updateUser } = require("../controllers/user");
const auth = require("../middlewares/auth");

router.use(auth);
router.get("/me", getUser);
router.patch("/me", updateUser);
module.exports = router;
