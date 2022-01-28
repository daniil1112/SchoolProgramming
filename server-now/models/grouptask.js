const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const groupTaskSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true
    },
    type:{
        type: Number,
        required:true
    },
    teacher: {
        type: Number,
        required: true
    },
    title:{
        type:String,
        required: true
    },
    group:{
        type: Number,
        required: true,
    },
    task:{
        type: Number,
        required: true
    },
    startTime:{
        type: String,
        required: true
    },
    stopTime:{
        type: String,
        required: true
    },
    options:{
        type: Object,
        default: {}
    },
    date:{
        type:Number,
        default: Date.now()
    }
});

groupTaskSchema.plugin(autoIncrement.plugin, '_id');

mongoose.model('groupTask',groupTaskSchema);
