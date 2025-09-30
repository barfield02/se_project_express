const router = require("express").Router();
const { createUser, getUser } = require("../controllers/user");

router.get("/:userId", getUser);
router.post("/", createUser);

module.exports = router;
