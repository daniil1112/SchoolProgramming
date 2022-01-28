const mongoose = require("mongoose");


const LanguagesSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    label:{
        type: String,
        required: true
    },
    active:{
        type: Boolean,
        required: true
    },
    prism:{
        type: String,
        required: true
    }
});

mongoose.model('ProgrammingLangs',LanguagesSchema );
