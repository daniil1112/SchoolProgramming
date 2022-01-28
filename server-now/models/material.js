const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const materialsSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    type:{
        type: String,
        default: 'default'
    },
    user:{
        type: Number,
        required: true
    },
    text:{
        type: String,
        default: ''
    },
    title:{
        type: String,
        required: true
    }
});


materialsSchema.plugin(autoIncrement.plugin, '_id');


mongoose.model('material',materialsSchema );
