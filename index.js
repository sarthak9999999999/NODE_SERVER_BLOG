const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const app = express();
app.use(express.json());
app.use(passport.initialize());

const port = process.env.PORT || 5000;
//const host='0.0.0.0';


mongoose.connect("mongodb+srv://sarthak_admin:if(pass==2)%23@cluster0.jh7pu.mongodb.net/myapp?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

conn = mongoose.connection;
conn.once("open", () => {
    console.log("Successfully Connected to MongoDB");
});



const userRoute = require("./routes/user");
app.use("/user", userRoute);

app.route("/").get((req, res) => {
    res.json("Your API IS RUNNING UP!!");
});

app.listen(port, () => {
    console.log("Server running");
});
