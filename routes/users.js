const router = require("express").Router();
const { createUser, getUser, getUsers } = require("../controllers/user");

router.get("/:userId", getUser);
router.post("/", createUser);
router.get("/", getUsers);
module.exports = router;
