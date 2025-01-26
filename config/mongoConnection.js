const mongoose = require("mongoose");
const debug  =  require("debug")("development:mongoose")

mongoose.connect(`your mongo db uri`)
.then(()=>{
    debug("DB CONNECTED!");
})
.catch((e) => {
    debug("NOT CONNECTED "  + e.message);
})

module.exports = mongoose.connection;
