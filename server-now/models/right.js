const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);


const rightSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true
    },
    groupUser:{
        type: Number,
        required: true
    },
    right:{
        type: JSON,
        required: true
    }
});

rightSchema.plugin(autoIncrement.plugin, '_id');

mongoose.model('Right',rightSchema);
