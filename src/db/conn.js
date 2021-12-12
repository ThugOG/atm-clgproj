//included mongoose
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://sahil:thakur@cluster0.w3oe1.mongodb.net/atmsys?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>{
    console.log("Connection Established");
})
.catch((err)=>{
    console.log(err);
});

module.exports