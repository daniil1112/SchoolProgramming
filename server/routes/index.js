const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {only_auth} = require("./../middlewares");

const tests = mongoose.model('Test');
const blockTest = mongoose.model('BlockOfTestes');
const BlockOfTestesReport = mongoose.model('BlockOfTestesReport');

router.post('/newtest',only_auth, async (req,res)=>{
    const result = await tests.create({
        title: req.body.title,
        text: req.body.text,
        teacher: req.userid,
        answers: req.body.answers,
        answer: req.body.answer
    });

    res.json({test:result});
});

router.post('/getTest',only_auth,async (req,res)=>{
   const result = await tests.findOne({_id:req.body._id});
   res.json({tests:result})
});

router.post('/checkTest',only_auth,async (req,res)=>{
    const result = await tests.findOne({_id:req.body._id});
    var successAnswer = false;
    if (result.answer === req.body.answer)  successAnswer = true;
    res.json({successAnswer: successAnswer});
});

router.post('/teacherTestes',only_auth,async (req,res) =>{
    const testsAll = await tests.find({teacher: req.userid});

    res.json({
        testes: testsAll
    })
});

router.post('/addTestsGroup',only_auth,async (req,res) =>{
    const block = new blockTest({
        testes: req.body.testes,
        teacher: req.userid,
        title: req.body.title
    });
    try {
        const resultBlock = await block.save();

        if (resultBlock) res.json({success: true})
    }catch (error) {
        res.json({errors: true})
    }

});

router.post('/loadTestsInGroup',only_auth,async (req,res) =>{
    const block =await blockTest.findOne({_id: req.body.id});
    var test = null;
    var testes = [];

    for (var i = 0; i < block.testes.length; i++) {
        try{
            test = await tests.findOne({_id:block.testes[i]});
            if (test) testes.push(test);
        }catch (e) {

        }
    }

    res.json({tests:testes});
});

router.post('/checkTestsInGroup',only_auth,async (req,res) =>{
    const block =await blockTest.findOne({_id: req.body.id});
    var result = [];

    for (var i = 0; i < block.testes.length; i++) {
        test = await tests.findOne({_id:block.testes[i]});
        if (test.answer === req.body.answers[i]) result[i] = 1;
        else result[i] = 0
    }

    res.json({results: result})

});

router.post('/allTeacherTestBLocks',only_auth,async (req,res)=>{
    const blocks = await blockTest.find({teacher: req.userid});

    if (blocks.length > 0 ) res.json({
        blocks:blocks
    });
    else res.json({
        blocks:false
    });


});

router.post('/setReportTestsInGroup',only_auth,async (req,res) =>{
    const block =await blockTest.findOne({_id: req.body.id});
    var points = [];
    const parent = block._id;
    const user = req.userid;
    var userAnswers = [];
    var rightAnswers = [];
    for (var i = 0; i < block.testes.length; i++) {
        test = await tests.findOne({_id:block.testes[i]});
        if (test.answer === req.body.answers[i]) points[i] = 1;
        else points[i] = 0;
        rightAnswers[i] = test.answers[test.answer].value;
        if (req.body.answers[i] !== -1) userAnswers[i] = test.answers[req.body.answers[i]].value;
        else userAnswers[i] = null
    }

    const report = new BlockOfTestesReport({
        parent,
        user,
        userAnswers,
        points,
        rightAnswers
    });

    const result = await report.save();
    res.json({
        report: result
    })

});



router.post('/FindReportTestsBlock',only_auth,async (req,res) =>{
    const block =await blockTest.findOne({_id: req.body.id});

    const report = await BlockOfTestesReport.findOne({
        parent: block._id,
        user: user._id
    });

    if (report) res.json({report:report});
    else res.json({report: false})

});

router.use('/api/', require('./api/'));
router.use('/rights/', require('./rights/'));

module.exports = router;