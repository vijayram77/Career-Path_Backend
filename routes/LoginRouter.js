const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/", async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        // // // console.log(user);
        

        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                return res.status(500).send("Error in password comparison");
            }
            if (result) {
                const cookie = jwt.sign({email}, "Secret");
                res.cookie("token", cookie, {
                    httpOnly: true,     
                    maxAge: 24 * 60 * 60 * 1000,    
                    sameSite: 'None',   
                    secure: true        
                });
                // // // console.log(user.name);
                
                return res.status(200).json({message : "Logged In Successfully" , username : user.name});
            } else {
                return res.status(400).send("Invalid email or password");
            }
        });

    } catch (error) {
        return res.status(500).send(error.message);
    }
});


module.exports = router;

