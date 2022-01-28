const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const reportSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    type:{
        type: Number,
        required: true
    },
    task: {
        type: Number,
        required: true,
    },
    user: {
        type: Number,
        required: true
    },
    points:{
        type: Number,
        required: true
    },
    attemp:{
        type:Number,
        required: false
    },
    verdict:{
        type: Object,
        required: false
    },
    answers:{
        type:Array,
        required: false
    },
    earlyClose:{
        type: Boolean,
        required: false
    }
});

reportSchema.plugin(autoIncrement.plugin, '_id');


mongoose.model('report',reportSchema);
