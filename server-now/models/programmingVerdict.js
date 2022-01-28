const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const programmingVerdict = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
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
        required: true
    },
    verdict:{
        type: Object
    }
});

programmingVerdict.plugin(autoIncrement.plugin, '_id');


mongoose.model('programmingVerdict',programmingVerdict );
