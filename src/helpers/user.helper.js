const bcrypt = require("bcryptjs");

async function encryptPassword(password) {
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  encryptPassword,
};
