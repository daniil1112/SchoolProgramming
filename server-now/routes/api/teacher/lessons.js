const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth_teacher} = require("./../../../middlewares");
const {getTimestamp} = require('./../../../helpres/timestamp');

const lessonDB = mongoose.model('lesson');
const blockTestsInDB = mongoose.model('BlockOfTestes');
const ProgrammingTask = mongoose.model('programmingTask');
const materialsInDb = mongoose.model('material');
const groupTaskBD = mongoose.model('groupTask');

router.post('/addLesson', check_auth_teacher, async (req,res)=> {
    let status;
    if (req.body.start && req.body.end && req.body.title && req.body.group){
        status = await lessonDB.create({
            teacher: req.userid,
            title: req.body.title,
            group: req.body.group,
            startTime: getTimestamp(req.body.start),
            expireAt: getTimestamp(req.body.end)
        })
    }
    if (status) {
        return res.json({status,
        start: req.body.start});
    }
    return res.json({
        created : false
    });
});

router.post('/loadLessons', check_auth_teacher, async (req,res)=> {
    let lessons;
    let start = req.body.start+' 00:00:00';
    let end = req.body.end + ' 23:59:59';
    if (req.body.start && req.body.end){

        lessons = await lessonDB.find({
            $and:[
                {startTime : {$gte: getTimestamp(start)} },
                {expireAt : {$lte: getTimestamp(end)} }
            ]
        });

    }

    return res.json({lessons})
});

router.post('/loadLesson', check_auth_teacher, async (req,res)=> {
    let lesson;

    if (req.body.id){
        lesson = await lessonDB.findById(req.body.id)
    }

    return res.json({lesson})
});

router.post('/loadMaterialBlockProgramming', check_auth_teacher, async (req,res)=> {
    const blocks = await blockTestsInDB.find({
        teacher: req.userid
    });


    const tasks = await ProgrammingTask.find({
        $and: [
            {teacher: req.userid},
            {ready: true}
        ]
    });

    const materials = await materialsInDb.find({
        user: req.userid,
    });

    return res.json({
        blocks,
        tasks,
        materials
    });

});


router.post('/updateMaterials', check_auth_teacher, async (req,res)=> {
    let lesson;

    if (req.body.id){
        lesson = await lessonDB.findById(req.body.id)
    }

    lesson.materials = req.body.materials;

    await lesson.save();

    return res.json({lesson})
});


router.post('/addTaskToGroup', check_auth_teacher, async (req,res)=> {
    let GroupTask;
    if (req.body.group && req.body.task && req.body.start && req.body.end && req.body.options && req.body.title){
        GroupTask = await groupTaskBD.create({
            teacher: req.userid,
            group: req.body.group,
            type: req.body.type,
            task: req.body.task,
            startTime: req.body.start,
            stopTime: req.body.end,
            options: req.body.options,
            title: req.body.title
        })
    } else {
        return res.json({
            success: false
        })
    }
    if (GroupTask){
        return res.json({
            GroupTask,
            success: true
        })
    }
});

router.post('/loadCreatedTasks', check_auth_teacher, async (req,res)=> {
    //TODO валидация входных параметров

    let GroupTasks;
    if (req.body.group){
        GroupTasks = await groupTaskBD.find({group: req.body.group})
    } else {
        return res.json({
            group: req.body.group,
        })
    }

    if (GroupTasks){
        return res.json({
            GroupTasks
        })
    }
});



module.exports = router;