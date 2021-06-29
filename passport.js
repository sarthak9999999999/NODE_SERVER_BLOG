var jwtStrategy=require("passport-jwt").Strategy;
var extractJwt=require("passport-jwt").ExtractJwt;
const conf=require("../NODE_SERVER_BLOG/config");
var user_model=require("./models/users.models");

module.exports=function(passport)
{
    //console.log("Passport Auth working!!");
    passport.use(new jwtStrategy(
        {

        secretOrKey : conf.key,
        jwtFromRequest : extractJwt.fromAuthHeaderAsBearerToken(),
        },
        function(jwt_data,next)
        {
            user_payload=jwt_data;
            user_model.findOne({username : jwt_data.username},
             (err,result)=>{
                 if(err)
                 {
                     return next(err,false);
                 }
                 if(result)
                 {
                    next(null,result); 
                 }
                 else{
                     next(null,false);
                 }
             })

        }

    ))
}
