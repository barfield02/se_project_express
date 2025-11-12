const ClothingItem = require("../models/clothingItem");
const {
  BADREQUEST,
  INTERNALERROR,
  NOTFOUND,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(res);
  console.log(req.body);
  const owner = req.user._id;

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(BADREQUEST)
          .send({ message: "Error from createItem" });
      }
      return res
        .status(INTERNALERROR)
        .send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);

      return res
        .status(INTERNALERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res.status(FORBIDDEN).send({ message: "Error from deleteItem" });
      }
      return item.deleteOne().then(() => {
        return res.status(200).send({ message: "Successful" });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOTFOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BADREQUEST).send({ message: "Invaild item ID" });
      }
      return res
        .status(INTERNALERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOTFOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BADREQUEST).send({ message: "Invaild item ID" });
      }
      return res
        .status(INTERNALERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOTFOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BADREQUEST).send({ message: "Invaild item ID" });
      }
      return res
        .status(INTERNALERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
