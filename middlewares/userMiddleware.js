const jwt = require("jsonwebtoken");
const User = require('../models/User');


const requireAuth = async (req, res, next) => {
    const AuthHeader = req.headers.authorization;
  
    if (AuthHeader) {
      const token = AuthHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          return res.status(500).send({msg:"incorrect token"});
        } else {
          let user = await User.findById(decodedToken.Id);
          req.user = user;
          next();
        }
      });
    } else {
      return res.status(401).send({msg:'Authentication required'});
    }
  };

  module.exports = { requireAuth }