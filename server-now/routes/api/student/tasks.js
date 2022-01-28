const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();


const {getTimestamp} = require('./../../../helpres/timestamp');
const {check_auth} = require("./../../../middlewares");


const blockTestsInDB = mongoose.model('BlockOfTestes');
const ProgrammingTask = mongoose.model('programmingTask');
const materialsInDb = mongoose.model('material');
const lessonDB = mongoose.model('lesson');
const groupTaskBD = mongoose.model('groupTask');
const Users = mongoose.model('User');


router.post('/loadTasks',check_auth, async (req,res) => {
    const {userid} = req;
    const {type} = req.body;

    const {group} = await Users.findById(userid);
    const tasks =await groupTaskBD.find({group,type});

    if (type === 2){
        let ids = [];
        tasks.forEach(e => ids.push(e.task))
        const ProgrammingTasks =await ProgrammingTask.find({
            _id: {$in: ids}
        })

        tasks.forEach( (e,i) => {
            let prTask = ProgrammingTasks.find(n => n._id === e.task);
            tasks[i].options.template = prTask.template.length > 0
        })

    }

    return res.json({
        tasks
    });
});



module.exports = router;