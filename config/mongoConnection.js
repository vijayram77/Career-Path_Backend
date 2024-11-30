const mongoose = require("mongoose");
const debug  =  require("debug")("development:mongoose")

mongoose.connect(`mongodb+srv://Jay799:Jay777@careerpath.z23ys.mongodb.net/?retryWrites=true&w=majority&appName=CareerPath`)
.then(()=>{
    debug("DB CONNECTED!");
})
.catch((e) => {
    debug("NOT CONNECTED "  + e.message);
})

module.exports = mongoose.connection;