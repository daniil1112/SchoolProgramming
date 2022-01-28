const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth_teacher} = require("./../../../middlewares");
const validateService = require('./../../../helpres/validate');


const testInDB = mongoose.model('test');
const blockTestsInDB = mongoose.model('BlockOfTestes');

router.post('/addTest',check_auth_teacher, async (req,res) =>{
    let {code} = validateService().teacher().CreateTestValidate(req.body);
    if (code) return res.json({ code });
    let rightAnswer = [];
    if (req.body.type === 1 || req.body.type === 3){
        rightAnswer = req.body.rightAnswer;
    }else if (req.body.type === 2){
        if (req.body.rightAnswer instanceof Array ||req.body.rightAnswer.length>1) {
            rightAnswer = req.body.rightAnswer;
            //сортировка по убыванию
            rightAnswer.sort(function(a, b) {
                return a - b;
            });
        } else {
            rightAnswer.push(req.body.rightAnswer);
        }
    }

    const result = await testInDB.create({
        title: req.body.title,
        task: req.body.task,
        type: req.body.type,
        user: req.userid,
        answerChoice: req.body.answerChoice,
        rightAnswer: rightAnswer
    });


    await res.json({id:result._id})
});

router.post('/update',check_auth_teacher, async (req,res) =>{
    let {code} = validateService().teacher().CreateTestValidate(req.body);
    if (code) return res.json({ code });
    if (!req.body._id) return res.json({ code: 5 });
    let test = await testInDB.findOne({
        user: req.userid,
        _id: req.body._id
    });
    if (!test) return res.json({ code: 6 });
    let rightAnswer = [];
    if (req.body.type === 1 || req.body.type === 3){
        rightAnswer = req.body.rightAnswer;
    }else if (req.body.type === 2){
            rightAnswer = req.body.rightAnswer;
            //сортировка по убыванию
            rightAnswer.sort(function(a, b) {
                return a - b;
            });
    }
    test.title = req.body.title;
    test.task = req.body.task;
    test.type = req.body.type;
    test.answerChoice = req.body.answerChoice;
    test.rightAnswer = rightAnswer;

    const result = await test.save();

    await res.json({test : result })
});

router.post('/load', check_auth_teacher, async (req,res) => {
    //code 1 - тест не найден
   const {testId} = req.body;
   const {userid} = req;

   const test = await testInDB.findOne({
       _id: testId,
       user: userid
   });

   if (test) return res.json({test});
   return res.json({code:1})

});


router.post('/allTests',check_auth_teacher, async (req,res) =>{
    const PerPage =20;
    const result = await testInDB.find({
        user: req.userid
    })
        .limit(PerPage)
        .skip((req.body.page-1)*PerPage)
        .sort({
            _id: "DESC"
        });

    await res.json({tests: result});
});



router.post('/createblock',check_auth_teacher, async (req,res) =>{
    //TODO валидация входных данных
    //type: 1-single answer, 2-muityAnswer 3- openAnswer


    const result = await blockTestsInDB.create({
        title: req.body.title,
        tests: req.body.tests,
        teacher: req.userid
    });

    await res.json({
        result,
    })

});

router.post('/loadBlocks',check_auth_teacher, async (req,res) =>{
    //TODO валидация входных данных
    //type: 1-single answer, 2-muityAnswer 3- openAnswer


    const blocks = await blockTestsInDB.find({
        teacher: req.userid
    });

    await res.json({
        blocks,
    })

});

module.exports = router;