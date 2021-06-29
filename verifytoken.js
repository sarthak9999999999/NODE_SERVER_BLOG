const jwt = require("jsonwebtoken");
const config = require("./config");

let checkToken = (req, res, next) => {
 try{
  let token = req.headers.authorization;
  console.log(token);
  token = token.slice(7, token.length);
  if (token) {
    jwt.verify(token, config.key, (err, decoded) => {
      if (err) {
        return res.json({
          status: false,
          msg: "token is invalid",
        });
      } else {
        req.decoded = decoded;
        //var username=decoded.username;
        next();
      }
    });
  }
 }catch(error)
 {
    return res.status(401).json(
        {
            response : "Authentication Failed!!"
        }
    );
 }
};

module.exports = {
  verifyToken: checkToken,
};

/*module.exports=(req,res,next)=>{
    try
    {
    const token=req.headers.authorization;
    console.log(token);
    const decoded=jwt.verify(req.body.token,c_key);
    req.decoded=decoded;
    next();
}
catch(error){
    return res.status(401).json(
        {
            response : "Failed!!"
        }
    );
}
}*/