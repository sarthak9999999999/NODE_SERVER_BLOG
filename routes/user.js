const { response } = require("express");
const express=require("express");
const User=require("../models/users.models");
const configg=require("../config");
const key=require("../nodemon.json");
const jwt=require("jsonwebtoken");
const middleware = require("../verifytoken");
const verifytoken = require("../verifytoken");
const { verifyToken } = require("../verifytoken");
const passport=require("passport");
require("../passport")(passport);

 //middleware=require("../verifytoken");


const router=express.Router();




router.route("/signup").post((req,res)=>{

    const user=new User({

        username : req.body.username,
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email,
        password: req.body.password
    });

    user.save().then(()=> {
        console.log("New Account Created Successfully!!");
        res.status(200).json("Success!")
    }).catch(err =>
      {
        console.log(err);
        res.status(403).json(err);
    
    });
});

router.route("/updatepwd/:username").patch(middleware.verifyToken,(req,res) => { //this route updates password i.e. partial modifications in the database!! so we used patch()

    User.findOneAndUpdate(
            {username : req.params.username},
            {$set : {password : req.body.password}},
            (err,result)=>{
                if(err)
                { 
                return res.status(500).json({msg : "No User found!"});
                }
                const response={
                response : "Password Changed Successfully",
                username : req.params.username,
            };
            return res.json(response);
            }
    );
});

router.route("/delete/:username").delete(middleware.verifyToken,(req,res)=>{

    User.findOneAndDelete(
        {username : req.params.username},
        (err,result)=>{
            if(err) 
            {
                return res.status(500).json({msg : err});
            }
            const resp={
            response : "User Deleted Successfully",
            username : req.params.username,
            };
        return res.json(resp);
        }
    );
});

router.route("/:username").get(passport.authenticate("jwt",{session : false}), (req, res) => {
    User.findOne({ username: req.params.username }, (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      return res.json({
        data: result,
        username: req.params.username,
      });
    });
  });


router.route("/login").post((req,res)=>{

    User.findOne({username : req.body.username},
        (err,result)=>{
            if(err)
            {
                return res.status(500).json({msg : err});
            }
            if(result===null)
            {
                return res.status(403).json("User Does not exist!!");
            }
             if(result.password === req.body.password)
            {
                const token =  jwt.sign({username : req.body.username}, process.env.config_key,{
                    expiresIn : "24h"
                });
               
                res.json({
                    token : token,
                    response : "SignIn Token Generated!!"
                });
            }
            else{
                res.status(403).json("Inavlid Credentials!!");
            }
        });
});

router.route("/:username/follow").patch(passport.authenticate("jwt",{session : false}),(req,res)=>
{
   
    const query=req.body.username;   //current_logged_in_user!!
    //const userTofollow=User.findOne(req.params.username);
    //const currUser=User.findOne(query);
    if(req.params.username===query)
    {
        return res.status(403).json({"Cannot Follow" : "You cannot follow your own account!!"});
    }
    
         User.findOneAndUpdate(
         {username : req.params.username},
         {$addToSet : {followers : query}},
         {new : true},
         (err,result)=>{
             if(err)
             {
                 res.status(404).json({msg : "Error"})
             }
            User.findOneAndUpdate(
                 //{useFindAndModify : false},
                 {username : query},
                 {$addToSet : {following : req.params.username}},
                 {new : true}).then(result=>{
                     res.status(200).json({"Successfully followed" : req.params.username});
                 }).catch(err=>{
                     return res.status(422).json({error :err})
                 })

         }
    )
});


router.route("/:username/unfollow").patch(passport.authenticate("jwt",{session : false}),(req,res)=>
{
   
    const query=req.body.username;   //current_logged_in_user!!
    //const userTofollow=User.findOne(req.params.username);
    //const currUser=User.findOne(query);
    if(req.params.username===query)
    {
        return res.status(403).json({"Cannot Follow" : "You can neither follow nor Unfollow your own account!!"});
    }
    
         User.findOneAndUpdate(
         {username : req.params.username},
         {$pull : {followers : query}},
         {new : true},
         (err,result)=>{
             if(err)
             {
                 res.status(404).json({msg : "Error"})
             }
            User.findOneAndUpdate(
                 //{useFindAndModify : false},
                 {username : query},
                 {$pull : {following : req.params.username}},
                 {new : true}).then(result=>{
                     res.status(200).json({"Successfully Unfollowed" : req.params.username});
                 }).catch(err=>{
                     return res.status(422).json({error :err})
                 })

         }
    )
});


router.route("/verifyusername/:username").get((req,res)=>
{
    User.findOne({username : req.params.username},(err,result)=>{

        if(err)
        {
            res.json({Error : err});
        }

        if(result!=null)
        {
            return res.status(200).json({true : "This username already exists!!"});
        }
        else
        {
            return res.json({false :"Username is available!!"});
        }
    });
});





module.exports=router;