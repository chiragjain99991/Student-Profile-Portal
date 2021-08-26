const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
module.exports = (Id) => {
    return jwt.sign({Id},"profile portal project",{
        expiresIn: maxAge,
      });
}