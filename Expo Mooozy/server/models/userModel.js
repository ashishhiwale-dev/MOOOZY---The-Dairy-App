const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add name'],
        trip:true,
    },
    email:{
        type:String,
        required:[true, 'Please add email'],
        unique:true,
        trip:true,
    },
    password:{
        type:String,
        required:[true, 'Please add Password'],
        min:6,
        max:32,
    },
    role:{
        type:String,
        default:'user'
    }
},{timestamps:true}
);

module.exports = mongoose.model("User", userSchema);