const jwt = require("jsonwebtoken");
async function jwtTokenGenerator(data) {
  const token = jwt.sign(data, "Login_Secret", {
    expiresIn: "48h",
  });
  return token;
}

module.exports = {
  jwtTokenGenerator,
};
