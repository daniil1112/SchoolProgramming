const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth} = require("./../../../middlewares");

const testInDB = mongoose.model('test');
const blockTestsInDB = mongoose.model('BlockOfTestes');
const blockOfTestesReport = mongoose.model('BlockOfTestesReport');
const groupTaskBD = mongoose.model('groupTask');

router.post('/loadTests',check_auth, async (req,res) =>{
    //TODO валидация входных данных


    //......

    let taskId = req.body.taskId;
    const task = await groupTaskBD.findById(taskId);

    const block = await blockTestsInDB.findById(task.task);


    if (!block){
        //Лучше редиректнуть
        return res.json({
            tests: null
        })
    }


    const tests = await testInDB.find({
        _id: {
            $in: block.tests
        }
    });

    return  res.json({
        tests,block
    })

});


router.post('/createReport',check_auth, async (req,res) =>{
    //TODO валидация входных данных

    //......

    // LoadRightAnswers
    const block = await blockTestsInDB.findById(req.body.block);
    const tests = await testInDB.find({
        _id: {
            $in: block.tests
        }
    });

    let report;
    // Поиск отчета по уроку(сделать)+ пользователю

    report = await blockOfTestesReport.findOne({
        user: req.userid
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
            if (!(req.body.answers[i] instanceof Array)){
                if (req.body.answers[i] ===tests[i].rightAnswer){
                    points = points +1
                }
            } else {
                if (tests[i].rightAnswer.length===1){
                    if (tests[i].rightAnswer[0]===req.body.answers[i]){
                        points = points+1
                    }
                } else if (JSON.stringify(req.body.answers[i]) ===JSON.stringify(tests[i].rightAnswer) ){
                    points = points+1
                }
            }
        }
    }
    if (!report){
        report = await blockOfTestesReport.create({
            user:req.userid,
            answers: req.body.answers,
            points: points
        });
    } else {
        report.answers = req.body.answers;
        report.points = points;
        report = await report.save();
    }
    return res.json({
        report,
        answers:req.body.answers,
        rightAnswers: tests
    });

});


module.exports = router;
