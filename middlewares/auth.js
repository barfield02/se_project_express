const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(UNAUTHORIZED).send({ message: "authorization required" });
  }
  req.user = payload;
  return next();
};

module.exports = auth;
