const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const blockTestReportSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    parent:{
        type: String,
        required: true
    },
    user:{
        type: Number,
        required: true
    },
    userAnswers:{
        type: Array,
        required: true
    },
    points:{
        type: Array,
        required: true
    },
    rightAnswers:{
        type: Array,
        required: true
    }
});

blockTestReportSchema.plugin(autoIncrement.plugin, '_id');


mongoose.model('BlockOfTestesReport',blockTestReportSchema );
