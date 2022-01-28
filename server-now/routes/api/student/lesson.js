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

router.post('/loadTask', check_auth, async (req,res) => {
    let task;

    task = await groupTaskBD.findById(req.body.taskId);


    return res.json({
        task,
    });

});



router.post('/loadLesson',check_auth, async (req,res) => {
    let result;
    let type;
    const lesson =await lessonDB.findById(req.body.id);
    const Tests =await blockTestsInDB.find({_id: {$in: lesson.materials}});
    const Programming =await ProgrammingTask.find({_id: {$in: lesson.materials}});
    const Materials = await materialsInDb.find({_id: {$in: lesson.materials}});


    return res.json({
        lesson, Tests,Programming,Materials
    });

});

router.post('/loadTasks',check_auth, async (req,res) => {
    const User = await Users.findById(req.userid);
    const tasks =await groupTaskBD.find({group: User.group});



    return res.json({
        tasks
    });

});



module.exports = router;