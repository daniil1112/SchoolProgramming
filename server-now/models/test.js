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
    task:{
        type:String,
        required: true,
    },
    type:{
        type:Number,
        required: true
    },
    user:{
        type: Number,
        required: true,
    },
    answerChoice: {
        type: Array,
        default: []
    },
    rightAnswer:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});


testSchema.plugin(autoIncrement.plugin, '_id');


mongoose.model('test',testSchema );
