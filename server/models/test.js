const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const testSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true,
    },
    text:{
        type:String,
        required: true,
    },
    teacher:{
        type: Number,
        required: true,
    },
    answers: {
        type: Array,
        required: true
    },
    answer:{
        type: Number,
        required: true
    }
});


testSchema.plugin(autoIncrement.plugin, '_id');


mongoose.model('Test',testSchema );
