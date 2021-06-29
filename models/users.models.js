const mongoose=require("mongoose");

const schema=mongoose.Schema;

const RegisterUser = schema(
    {
        username :{type : String , required : true , unique : true},
        name  : {type : String,required : true,unique : false},
        phone : {type : String,required : false,unique : true},
        email : {type : String, required : true,},
        password : {type : String,required : true},
        following : [],
        followers : [],
    }
);

module.exports = mongoose.model("User",RegisterUser);