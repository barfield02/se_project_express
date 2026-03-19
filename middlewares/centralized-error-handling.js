const centralizedErrorHandling = (err, req, res) => {
  console.error(err);
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res
    .status(err.statusCode)
    .send({ message: "An error occurred on the server" });
};

module.exports = centralizedErrorHandling;
