const express=require("express");
const mongoose=require("mongoose");
const passport=require("passport");
const app=express();
app.use(express.json());
app.use(passport.initialize());


mongoose.connect("mongodb+srv://sarthak_admin:if(pass==2)%23@cluster0.jh7pu.mongodb.net/myapp?retryWrites=true&w=majority", { useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology:true});

 conn = mongoose.connection;
 conn.once("open", ()=>{
    console.log("Successfully Connected to MongoDB");
});


const userRoute = require("./routes/user");
app.use("/user",userRoute);

app.route("/").get((req,res)=> {
    res.json("Your API IS RUNNING UP!!");
});

app.listen(process.env.PORT || 5000,()=> {
    console.log("Server running on port number : %d in %s mode", this.address().PORT ,app.settings.env);
});
