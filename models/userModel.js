const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name : {
        type : String
    } ,
    email : {
        type : String
    } ,
    password : {
        type : String
    } ,
    posts : {
        type : Array ,
        default : []
    },

})

module.exports = mongoose.model("user", userSchema)