const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    creator:{
      type: String,
      required: true
    },
    shortTitle:{
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    title:{
        type: String,
        required: true,
        min:6,
        unique: true
    },
    body:{
        type: String,
        required: true,
        min:6,
    },
    files: {
        type: String,
        required: false,
        default: null
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
});


mongoose.model('Task',taskSchema);
