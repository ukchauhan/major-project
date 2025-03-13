const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMangoose = require("passport-local-mongoose");

const usrSchema = new Schema({
    email:{
        type:String,
        required:true
    },
});

usrSchema.plugin(passportLocalMangoose);

module.exports = mongoose.model('User', usrSchema);