function authenticateToken(req, res, next) {
  const jwt = require("jsonwebtoken");
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  jwt.verify(token, "Login_Secret", (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
};
