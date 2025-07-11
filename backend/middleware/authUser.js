const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token == null) return res.sendStatus(401);
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;

    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

module.exports = authenticateUser;
