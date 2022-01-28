const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const lessonSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true
    },
    teacher:{
        type: Number,
        required: true
    },
    title:{
        type:String,
        required: true
    },
    group:{
        type:Number,
        required: true
    },
    startTime:{
        type: Number,
        required: true
    },
    expireAt:{
        type: Number,
        required: true
    },
    materials: {
        type: Array,
        default: []
    }
});

lessonSchema.plugin(autoIncrement.plugin, '_id');

mongoose.model('lesson',lessonSchema);
