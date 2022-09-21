const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header("token");

  if (!token) {
    return res.status(200).json({ message: "Authorization denied" });
  }

  // Verify token
  try {
    await jwt.verify(token, process.env.jwtSecret, (error, decoded) => {
      if (error) {
        res.status(200).json({ message: "Token is not valid" });
      } else {
        req.user = decoded.user; // decoded.user  equals user's id
        next();
      }
    });
  } catch (err) {
    console.error("Middleware error");
    res.status(200).json({ message: "Server Error" });
  }
};
