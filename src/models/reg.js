 const mongoose = require('mongoose');
const User = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    card:{
        type: String,
        required:true,
        maxlength:16,
        unique:true
    },
    pin:{
        type: String,
        required: true,
        unique:true,
    },
    balance:{
        type: Number,
        required: false,
        default: 10000
    },
    active: {
        type: Boolean,
        default:true
    },
    token:[{
        token:{
            type:String,
            required:true
        }
    }]
});
 
const UserModel = new mongoose.model('Accounts', User)


module.exports = UserModel;