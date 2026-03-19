const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secert-please-update-in-production";

module.exports = {
  JWT_SECRET,
};
