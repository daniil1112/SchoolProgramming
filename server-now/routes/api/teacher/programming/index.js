const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth_teacher} = require("../../../../middlewares");
const {loadTask} = require("../../../../middleware/teacher/programming");
const {validateTaskId, validateAddResolveAttemp} = require("../../../../validate/programming");
const validateService = require('../../../../helpres/validate');
const {resError} = require('../../../../helpres/ResultErrorGenerate');



const ProgrammingTask = mongoose.model('programmingTask');
const ProgramAttempDB = mongoose.model('programAttempt');
const ProgramLangsDB = mongoose.model('ProgrammingLangs');

router.post('/loadTask',validateTaskId, check_auth_teacher, loadTask, async (req,res) => {
    return res.json({task: req.task})
});

router.post('/allTasks',check_auth_teacher, async (req,res) => {
    const tasks = await ProgrammingTask.find({
        teacher: req.userid
    })
    if (!tasks) return resError(res,'Ошибка при загрузке задач')
    return res.json({tasks})
});

router.post('/counterTasks',check_auth_teacher, async (req,res) => {
    const counter = await ProgrammingTask.count({
        teacher: req.userid
    })
    if (typeof counter !== 'number') return resError(res,'Ошибка при загрузке задач')
    return res.json({counter})
});

router.post('/getAttemps',check_auth_teacher,async (req,res) => {
    const attemps = await ProgramAttempDB.find({
        $and:[
            {taskId: req.body.taskId},
            {type: 'teacher'}
        ]});

    return res.json({attemps})
});
router.post('/loadSuccessAttemp',validateTaskId, check_auth_teacher, loadTask, async (req,res) => {
    const attemp = await ProgramAttempDB.findById(req.task.solvedAttemp);

    return res.json({
        attemp
    })
});

router.post('/checkInCompile', validateTaskId, check_auth_teacher,async (req,res) => {
    const attemp = await ProgramAttempDB.findOne({
        $and:[
            {taskId: req.taskId},
            {   $or:[
                    {status: 'waiting'},
                    {status: 'compiling'}
                    ]}
        ]
    });

    if (attemp) {return res.json({
        compiling: true
    }) } else { return res.json({
        compiling: false
    })}

});

router.post('/addResolveAttemp',validateAddResolveAttemp, check_auth_teacher, loadTask, async (req,res) => {
    //TODO валидация доступных языков
    let {task,program,programLang} = req;

    if (task.input.length === 0) return resError(res, 'Вы пропустили предыдущий шаг');

    const attemp =await ProgramAttempDB.create({
        taskId: req.body.taskId,
        user: req.userid,
        program,
        programLang,
        input: task.input,
        type: 'teacher'
    });

    if (attemp) return res.json({
        attemp
    });

    return resError(res, 'Неожиданная ошибка при создании программы');

});




router.post('/verdict',check_auth_teacher, async (req,res) =>{
    const attemp = await ProgramAttempDB.findOne({
        $and:[
            {_id: req.body.programId},
            {type: 'teacher'}
        ]
    }).select('_id verdict program programLang');

    return res.json({
        verdict: attemp.verdict,
        program: attemp.program,
        programLang: attemp.programLang
    })
});

router.get('/loadLangs',check_auth_teacher, async (req,res) =>{
    const langs = await ProgramLangsDB.find({ active: true})

    return res.json({ langs })
});

router.post('/loadAttemps',check_auth_teacher, async (req,res) =>{
    const attemps = await ProgramAttempDB.find({
        $and:[
            {taskId:req.body.taskId},
            {user: req.userid},
            {type:'teacher'}
        ]
    }).select('_id verdict status programLang program input output time');

    return res.json({
        attemps
    })
});



router.post('/addInputAttemp', check_auth_teacher, async (req,res)=> {
    let {taskId, program, input, programLang} = req.body;

    if (!taskId || !program || !programLang || !input) return resError(res,'Входные данные имеют неверный формат');
    const task = await ProgrammingTask.findOne({
        $and: [
            {_id : taskId},
            {teacher: req.userid}
        ]
    });

    if (!task) return resError(res,'Задание не найдено');
    if (task.ready) return resError(res,'Изменение запрещено');

    task.input = [];
    task.solved = false;
    task.timeLimit = 0;
    task.template=[];
    task.set('type', undefined, { strict: false })


    const updateSolved = await task.save();
    if (!updateSolved) return resError(res,'Ошибка при сохранении задания');

    let inputArray = Array(input).fill('');
    inputArray.forEach( function (element, i) {
        inputArray[i] = i+1;
    });

    const attemp = await ProgramAttempDB.create({
        taskId: taskId,
        user: req.userid,
        program: program,
        input: inputArray,
        programLang: programLang,
        parent: 0,
        type: 'input'
    });

    if (!attemp) return resError(res,'Ошибка при сохранении задания');
    return res.json({attemp})
});

router.post('/reloadAttemps', check_auth_teacher, async (req, res) => {
   const {ids} = req.body;
   if (!ids || ids.length === 0) return res.json({ attemps : []});

   const attemps = await ProgramAttempDB.find({ $and : [
           {_id: { $in : ids }},
           {user: req.userid}
       ]});
   return res.json({attemps});
});

router.post('/addInput',check_auth_teacher, async (req,res) =>{
    const {taskId, input} = req.body;
    if (!taskId|| !input) return resError(res,'Входные параметры имели неверный формат');
    const task = await ProgrammingTask.findById(req.body.taskId);
    if (!task) return resError(res,'Задача не найдена');

    if (task.ready) return resError(res,'Изменение запрещено');

    task.solved = false;
    task.timeLimit = 0;
    task.template=[];
    task.set('type', undefined, { strict: false })

    task.input = input

    const savedTask = await task.save();

    if (!savedTask) return resError(res,'Задача не сохранена');

    return res.json({input : savedTask.input})

});

router.post('/setType', check_auth_teacher, async (req,res) => {
    const {taskId, type, template} = req.body;
    if (!taskId|| !type) return resError(res,'Входные параметры имели неверный формат');
    if (type === 2 && (!template || template.length === 0 || !template.some( e => e === null)) ) return resError(res,'Шаблон задан с ошибками');

    const task = await ProgrammingTask.findOne({ $and: [
            {_id: req.body.taskId},
            {teacher: req.userid}
            ]});
    if (!task) return resError(res,'Задача не найдена');

    task.type = type;



    if (type === 2) {
        const solvedAttemp = await ProgramAttempDB.findById(task.solvedAttemp);
        if (!solvedAttemp) return resError(res,'Ошибка при загрузке решения задачи');
        task.template = template;
        task.langs = [solvedAttemp.programLang]
    } else {
        task.template = [];
    }

    const savedTask = await task.save();

    if (!savedTask) return resError(res,'Задача не сохранена');

    return res.json({input : savedTask.input})
});


router.post('/updateTitleAndTask', check_auth_teacher, async (req,res) => {
    const {title, task, taskId} = req.body;
    if (!title || !task || (typeof title !== 'string') || (typeof task !== 'string') || title.length < 3 || title.length > 70 || task.length < 10 || task.length > 700 ) return resError(res,'Входные параметры имели неверный формат');

    const taskDB = await ProgrammingTask.findOne({ $and: [
            {_id: taskId},
            {teacher: req.userid}
        ]});
    if (!taskDB) return resError(res,'Задача не найдена');

    taskDB.title = title;
    taskDB.task = task;

    const savedTask = await taskDB.save();

    if (!savedTask) return resError(res,'Задача не сохранена');

    return res.json({})
})

router.post('/updateExamples', check_auth_teacher, async (req,res) => {
    const {examples, taskId} = req.body;
    if (!examples || !taskId || examples.length === 0) return resError(res,'Входные параметры имели неверный формат');

    const task = await ProgrammingTask.findOne({ $and: [
            {_id: taskId},
            {teacher: req.userid}
        ]});
    if (!task) return resError(res,'Задача не найдена');

    task.samples = examples;

    const savedTask = await task.save();

    if (!savedTask) return resError(res,'Задача не сохранена');

    return res.json({})
});


router.post('/setReady', check_auth_teacher, async (req,res) => {
    const {taskId} = req.body;
    if ( !taskId ) return resError(res,'Входные параметры имели неверный формат');

    const task = await ProgrammingTask.findOne({ $and: [
            {_id: taskId},
            {teacher: req.userid}
        ]});
    if (!task) return resError(res,'Задача не найдена');

    task.ready = true;

    const savedTask = await task.save();

    if (!savedTask) return resError(res,'Задача не сохранена');

    return res.json({})
})


router.post('/setLangs', check_auth_teacher, async (req,res) => {
    const {taskId, langs} = req.body;
    if (!taskId|| !langs) return resError(res,'Входные параметры имели неверный формат');


    const task = await ProgrammingTask.findOne({ $and: [
            {_id: req.body.taskId},
            {teacher: req.userid}
        ]});

    if (!task) return resError(res,'Задача не найдена');
    if (task.type === 2 ) return resError(res,'Языки заданий данного формата нельзя менять');
    if (task.langs.length === 1 && !langs.some( e => e === task.langs[0])) return resError(res,'Удаление языка решения запрещено!!!');


    task.langs = langs;

    const savedTask = await task.save();

    if (!savedTask) return resError(res,'Задача не сохранена');

    return res.json({})

});

router.post('/setTimelimit', check_auth_teacher, async (req,res) => {
    const {type, timeLimit, taskId} = req.body;

    if (!type|| !taskId || typeof timeLimit !== 'number') return resError(res,'Входные параметры имели неверный формат');


    const task = await ProgrammingTask.findOne({ $and: [
            {_id: req.body.taskId},
            {teacher: req.userid}
        ]});

    if (!task) return resError(res,'Задача не найдена');

    if (type === 1) task.timeLimit = 0;
    else if (type === 2){
        const solvedAttemp = await ProgramAttempDB.findById(task.solvedAttemp);

        if (!solvedAttemp) return resError(res,'Задача не решена');

        task.timeLimit = timeLimit
    }

    const savedTask = await task.save();

    if (!savedTask) return resError(res,'Задача не сохранена');

    return res.json({})

});




router.post('/loadAttempsInput',check_auth_teacher, async (req,res) =>{
    let {taskId} = req.body;
    if (!taskId) return resError(res,'Не передан номер задания');
    const attemps = await ProgramAttempDB.find({
        $and:[
            {taskId:req.body.taskId},
            {user: req.userid},
            {type:'input'}
        ]
    });

    if (!attemps) return resError(res,'Попытки не были найдены');

    return res.json({
        attemps
    })
});

router.post('/loadResolveAttemps',check_auth_teacher, async (req,res) =>{
    let {taskId} = req.body;
    if (!taskId) return resError(res,'Не передан номер задания');
    const attemps = await ProgramAttempDB.find({
        $and:[
            {taskId:req.body.taskId},
            {user: req.userid},
            {type:'teacher'}
        ]
    });

    if (!attemps) return resError(res,'Попытки не были найдены');

    return res.json({
        attemps
    })
});


router.post('/loadTasks',check_auth_teacher, async (req,res) =>{

        const tasks = await ProgrammingTask.find({
            $and: [
                {solved: true},
                {teacher: req.userid}
            ]
        });

        return res.json({
            tasks
        })
});


router.post('/newTask', check_auth_teacher, async (req,res) => {
    let {code} = validateService().teacher().CreateProgrammingTaskValidate(req.body);
    if (code) return res.json({ code });

    const task= new ProgrammingTask({
        title:req.body.title,
        task: req.body.task,
        teacher:req.userid,
        samples: req.body.examples
    });

    const saved = await task.save();


    if (saved) {
        return res.json({ id : saved._id});
    }
    return res.json({ code : 3})
});



router.use('/languages/', require('./languages'));


module.exports = router;