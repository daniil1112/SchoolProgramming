const mongoose = require('mongoose');
const ProgrammingTaskDB = mongoose.model('programmingTask');
const ProgramAttempDB = mongoose.model('programAttempt');
const {resError} = require('./../../helpres/ResultErrorGenerate');

const loadTask =async (req,res,next) => {
    let {taskId} = req;
    const task = await ProgrammingTaskDB.findOne({
        $and: [
            { _id : taskId },
            { teacher : req.userid }
        ]
    });
    if (!task) return resError(res, 'Ошибка при загрузке задания');
    req.task = task;
    next();
};

const loadSolvedAttemp = async (req,res,next) => {
    let {task} = req;
    const solvedAttemp = await ProgramAttempDB.findById(task.solvedAttemp)
    if (!solvedAttemp) return resError(res, 'Ошибка при загрузке задания');
    req.solvedAttemp = solvedAttemp;
    next();
};

module.exports.loadTask = loadTask;
module.exports.loadSolvedAttemp = loadSolvedAttemp;


