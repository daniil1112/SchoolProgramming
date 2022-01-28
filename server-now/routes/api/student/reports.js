const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth} = require("./../../../middlewares");

const programmingVerdict = mongoose.model('programmingVerdict');
const testInDB = mongoose.model('test');
const blockTestsInDB = mongoose.model('BlockOfTestes');
const blockOfTestesReport = mongoose.model('BlockOfTestesReport');
const groupTaskBD = mongoose.model('groupTask');
const reportDB = mongoose.model('report')

router.post('/createReport', check_auth, async (req,res) =>{
    let taskId = req.body.taskId;
    const task = await groupTaskBD.findById(taskId);
    const block = await blockTestsInDB.findById(task.task);
    const tests = await testInDB.find({
        _id: {
            $in: block.tests
        }
    });



    let report;


    report = await reportDB.findOne({
        user: req.userid,
        task: taskId
    });


    if (req.body.answers instanceof Array ){
        for (let i = 0; i<req.body.answers.length; i++){
            if (req.body.answers[i] instanceof Array){
                req.body.answers[i].sort(function(a, b) {
                    return a - b;
                });
            }
        }
    }



    let points = 0;

    for (let i = 0; i<req.body.answers.length; i++){
        if (req.body.answers[i] ||tests[i]){
            if (tests[i].type === 1 ||tests[i].type === 3){
                if (tests[i].rightAnswer ===req.body.answers[i]) points = points+1
            } else if (JSON.stringify(req.body.answers[i]) ===JSON.stringify(tests[i].rightAnswer) ){
                points = points+1
            }
        }
    }
    if (!report){
        report = await reportDB.create({
            type: 1,
            user:req.userid,
            task: taskId,
            answers: req.body.answers,
            points: points,
            earlyClose: false
        });
    } else {
        report.task = taskId;
        report.answers = req.body.answers;
        report.points = points;
        report = await report.save();
    }
    return res.json({
        report
    });
});


router.post('/closeTestsTask', check_auth, async (req,res) =>{
    let taskId = req.body.taskId;

    let report;
        report = await blockOfTestesReport.findOne({
            user: req.userid,
            task: taskId
        });

    if (!report){

        return res.json({
            taskId,
            error: true,
            code:2
        })
    }

    report.earlyClose = true;

    let result;

    try {
        result =await report.save();
        if (!result) return res.json({
            error: true,
            code:3
        })
    } catch (e) {
        return res.json({
            error: true,
            code:3
        })
    }

    return res.json({
        success: true,
        result
    });
});

router.post('/loadReport', check_auth, async (req,res) =>{
    let taskId = req.body.taskId;
    let task, report;

    if (!taskId){
        return res.json({
            success: false,
            message: 'No TaskID'
        })
    }

    task =await groupTaskBD.findById(taskId);

    if (task){
        if (task.type === 1 || task.type === 2){
            report = await reportDB.findOne({
                $and: [
                    {user: req.userid},
                    {task: task._id}
                ]
            })
        }
    }

    return res.json({
        report
    })

});


module.exports = router;
