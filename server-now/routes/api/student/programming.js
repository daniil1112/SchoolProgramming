const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const ProgramingTasks = mongoose.model('programmingTask');
const ProgramAttemps = mongoose.model('programAttempt');
const programmingVerdict = mongoose.model('programmingVerdict');
const groupTaskBD = mongoose.model('groupTask');
const ProgrammingLangsDB = mongoose.model('ProgrammingLangs')


const {loadGroupTask,loadUser, loadGroup, loadProgrammingTask} = require("./../../../middleware/student/programming");

const {validateLoadLangsForTask} = require("./../../../validate/programming");

const {validateTemplateToAddStudentAttemp} = require("./../../../validate/student/programming");

const {check_auth} = require("./../../../middlewares");


router.post('/loadTask',check_auth, async (req,res) =>{
    let task,groupTask;
    groupTask = await groupTaskBD.findById(req.body.taskId);
    if (groupTask){
        task = await ProgramingTasks.findById(groupTask.task).select('task title samples type template langs');
    }
    await res.json({task})
});

router.post('/addAttemp',check_auth, async (req,res) =>{
    const task = await ProgramingTasks.findById(req.body.taskId);
    //Валидация входа
    const programAttemp=new ProgramAttemps({
        taskId:req.body.taskId,
        user: req.userid,
        program: req.body.program,
        programLang: req.body.programLang,
        parent: task.solvedAttemp,
        groupTask: req.body.groupTask
    });
    const resultProgram = await programAttemp.save();
    await res.json({resultProgram})
});

router.post('/addTemplateAttemp',check_auth, validateTemplateToAddStudentAttemp, loadUser, loadGroupTask, loadProgrammingTask, async (req,res) =>{
    const {programmingTextTemplate, programmingTask, groupTask} = req

    let program = '';

    programmingTask.template.forEach((e, index) => {
        if (e !== null) program = program + e + '\n';
        else if ( programmingTextTemplate[index] ) program = program + programmingTextTemplate[index] + '\n'
    });

    const programAttemp=new ProgramAttemps({
        taskId: programmingTask._id,
        user: req.userid,
        program,
        programLang: programmingTask.langs[0],
        parent: programmingTask.solvedAttemp,
        groupTask: groupTask._id
    });
    const resultProgram = await programAttemp.save();
    await res.json({resultProgram})

});

router.post('/loadAttemps',check_auth, async (req,res) =>{
    const attemps = await ProgramAttemps.find({
        $and:[
            {user: req.userid},
            {groupTask: req.body.groupTask}
        ]
    }).select('_id verdict status programLang program');

    await res.json({
        attemps
    })
});

router.post('/loadTaskVerdict',check_auth, async (req,res) =>{
    const verdict = await programmingVerdict.findOne({
        $and:[
            {task:parseInt(req.body.taskId)},
            {user: req.userid},
            {groupTask: req.body.groupTask}
        ]
    });

    await res.json({
        verdict,
    })
});

router.post('/verdict',check_auth, async (req,res) =>{
    const attemp = await ProgramAttemps.findById(req.body.programId).select('_id verdict program programLang');

    await res.json({
        verdict: attemp.verdict,
        program: attemp.program,
        programLang: attemp.programLang
    })
});

router.post('/loadInput',check_auth, async (req,res) =>{
    const groupTask = await groupTaskBD.findById(req.body.groupTask);
    if (groupTask.options.visibleTests){
        const attemp = await ProgramAttemps.findById(req.body.attempId);
        const task = await ProgramingTasks.findById(attemp.taskId);
        return res.json({
            input: attemp.input[req.body.test],
            output: attemp.output[req.body.test]
        })
    } else {
        return res.json({
            error: true,
            code: 1
        })
    }
});

// router.post('/loadAcceptedLanguages',check_auth, validateLoadLangsForTask, loadUser, loadGroupTask, loadProgrammingTask, async (req, res) => {
//     return res.json({languages: req.programmingTask.langs})
// })

router.get('/loadLanguages', check_auth, async (req,res) => {
    const langs = await ProgrammingLangsDB.find({
        active: true
    })

    return res.json({langs})
})


module.exports = router;