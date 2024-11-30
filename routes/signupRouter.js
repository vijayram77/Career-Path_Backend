const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt");
// const isLoggedin = require("../middlewares/IsLoggedIn");


router.post("/" ,  async function (req, res) {
    console.log("User Came to Signup");
    
    const { email, password, username } = req.body;
    const existingUser = await userModel.findOne({ email })
    if(existingUser){
        return res.send("User Already Existed!")
    }

    bcrypt.hash( password , 10, async function (err , hash) {
        
        const createdUser = await userModel.create({
            name : username , 
            email ,
            password : hash
        })
        res.send("User Created Successfully")
        
    } )

})

module.exports = router;