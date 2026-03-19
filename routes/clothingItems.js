const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

const { validateCardBody, validateId } = require("../middlewares/validation");

router.post("/", auth, validateCardBody, createItem);

router.get("/", getItems);

router.delete("/:itemId", auth, validateId, deleteItem);

router.put("/:itemId/likes", auth, validateId, likeItem);

router.delete("/:itemId/likes", auth, validateId, unlikeItem);

module.exports = router;
