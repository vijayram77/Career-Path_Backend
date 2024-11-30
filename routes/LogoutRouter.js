const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser")
const app = express();



app.use(cookieParser())
router.get("/", async function (req, res) {
    // console.log(req.cookies.token);
    
    return res.cookie("token", "", {
        httpOnly: true,     
        maxAge: 3600000,    
        sameSite: 'None',   
        secure: true        
    }).status(200).send("Successfully logged out")
});


module.exports = router;

