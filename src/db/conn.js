//included mongoose
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/AccountNumbers",{useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>{
    console.log("Connection Established");
})
.catch((err)=>{
    console.log(err);
});

module.exports