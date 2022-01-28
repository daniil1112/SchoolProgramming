const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const userSchema = new mongoose.Schema({
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
    group: {
        type: Number,
        required: false,
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

userSchema.plugin(autoIncrement.plugin, '_id');

userSchema.methods.hashPassword = async function () {
    const salt = await bcrypt.genSalt(2);
    this.password =await bcrypt.hash(this.password, salt);
}



// userSchema.pre('save',async function () {
//     const salt = await bcrypt.genSalt(2);
//     this.password =await bcrypt.hash(this.password, salt);
// });

mongoose.model('User',userSchema);
