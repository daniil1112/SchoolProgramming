const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const programmingTask = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    task:{
        type: String,
        required: true
    },
    topic:{
        type: Number,
        required: false
    },
    teacher:{
        type:Number,
        required: true,
    },
    solved:{
        type: Boolean,
        default: false
    },
    solvedAttemp:{
        type: Number,
    },
    date:{
        type:Date,
        default: Date.now()
    },
    samples:{
        type: Array
    },
    input:{
        type: Array
    },
    type:{
        type: Number,
    },
    timeLimit:{
        type: Number,
        default: 0
    },
    ready:{
        type: Boolean,
        default: false
    },
    template: {
        type: Array
    },
    langs:{
        type: Array,
    }
});

programmingTask.plugin(autoIncrement.plugin, '_id');


mongoose.model('programmingTask',programmingTask );
