const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const blockTestSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    tests:{
        type: Array,
        required: true
    },
    teacher:{
        type: Number,
        required: true
    }
});



blockTestSchema.plugin(autoIncrement.plugin, '_id');


mongoose.model('BlockOfTestes',blockTestSchema );
