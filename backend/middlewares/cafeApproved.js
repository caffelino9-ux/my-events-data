const Cafe = require("../models/Cafe/Cafe_login");

const cafeApproved = async (req, res, next) => {
  if (!req.cafe || !req.cafe.id) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  const cafe = await Cafe.findById(req.cafe.id);

  if (!cafe || cafe.status !== true) {
    return res.status(403).json({
      message: "Cafe not approved by admin yet"
    });
  }

  next();
};

module.exports = cafeApproved;
