const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const groupSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true
    },
    groupTeacher:{
        type: Number,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    form:{
        type: Number
    }
});

groupSchema.plugin(autoIncrement.plugin, '_id');

mongoose.model('Group',groupSchema);
