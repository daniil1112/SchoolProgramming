const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const themeSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
    },
    text:{
        type: String,
        required: true
    },
    form:{
        type : Number
    },
    details: {
        type: String
    },
    teacher: {
        type: Number,
        required: true
    }
});

themeSchema.plugin(autoIncrement.plugin, 'theme');


mongoose.model('theme',themeSchema);
