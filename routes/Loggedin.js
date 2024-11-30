const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

router.get("/" , async function Loggedin(req, res) {
  var userToken = req.cookies.token;
  console.log(userToken);


  if(!userToken){
    return res.status(404).json({message : "NO Token Found"})
    
  }
  
  
    try {
      const result = jwt.verify(userToken, "Secret");
      console.log(result);
  
      const user = await userModel.findOne({ email : result.email }).select("-_id -password");
      // console.log(user, "user gaadu"); 
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
      }
      res.send(user)
    } catch (error) {
        console.log(error);
        
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
)
  module.exports = router