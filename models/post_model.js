const mongoose=require("mongoose");

const PostSchem=mongoose.Schema;

const NewPost=PostSchem(
    {
        title : {type : String, require : true},


})