const {User,Artist}=require('./db')

const jwt = require("jsonwebtoken");
const jwtPassword = "akash309";

async function userMiddleware(req, res, next) {
   
  const token = req.headers["authorization"];
      console.log("token at config",token)
    const decoded = jwt.verify(token, jwtPassword);
    console.log("decoded",decoded)
    const username = decoded.username;

    if(decoded){
      next();
    }else{
      res.status(403).json({
          msg:"user does not exist"
      })
    }
    }

module.exports = {userMiddleware,jwtPassword};