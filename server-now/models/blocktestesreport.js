const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const blockTestReportSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    user:{
        type: Number,
        required: true
    },
    answers:{
        type: Array,
        required: true
    },
    task:{
        type:Number,
        required: true
    },
    points:{
        type: Number,
        required: true
    },
    earlyClose:{
        type:Boolean,
        default: false
    }
});

blockTestReportSchema.plugin(autoIncrement.plugin, '_id');


mongoose.model('BlockOfTestesReport',blockTestReportSchema );
