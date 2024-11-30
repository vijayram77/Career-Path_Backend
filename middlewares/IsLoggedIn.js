const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

async function isLoggedin(req, res, next) {
  
  try {
    const userToken = req.cookies.token;
    if(!userToken){
      return res.status(401).send("Invalid User")
    }

    const result = jwt.verify(userToken, "Secret")
    const user = await userModel.findOne({ email: result.email });
    
    if (user) {
      next();
      req.user = user;

    }else{

      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = isLoggedin