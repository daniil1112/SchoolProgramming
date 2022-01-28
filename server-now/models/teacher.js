const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const teacherSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    login: {
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true,
        max: 1024,
        min:6,
    },
    lastip: {
        type: String,
        required: true
    },
    state: {
        type:Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

teacherSchema.methods.hashPassword = async function (){
    const salt = await bcrypt.genSalt(2);
    this.password =await bcrypt.hash(this.password, salt);
};

teacherSchema.plugin(autoIncrement.plugin, '_id');


mongoose.model('Teacher',teacherSchema,'users');
