const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const programAttempt = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    taskId:{
        type:Number,
        required: true,
    },
    groupTask:{
        type: Number,
        required: false
    },
    user:{
        type:Number,
        required: true,
    },
    program:{
        type:String,
        required: true
    },
    output:{
        type:Array,
        default: []
    },
    time:{
        type:Array,
        default:[]
    },
    compilerMSG:{
        type:Array,
        default: []
    },
    status:{
        type:String,
        default:'waiting'
    },
    programLang:{
        type:Number,
        required:true
    },
    input:{
        type:Array,
        required:true
    },
    parent:{
        type:Number,
        default:0
    },
    date:{
        type:Date,
        default: Date.now()
    },
    type:{
        type: String,
        default:"student"
    },
    verdict:{
        type: Object
    },
});

programAttempt.plugin(autoIncrement.plugin, '_id');


mongoose.model('programAttempt',programAttempt );
