const bcrypt = require("bcryptjs");
const saltRounds = 10;

const hashedPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
}

module.exports = hashedPassword;