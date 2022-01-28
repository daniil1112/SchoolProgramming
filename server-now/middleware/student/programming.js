const mongoose = require('mongoose');
const groupTaskDB= mongoose.model('groupTask');
const ProgramingTaskDB = mongoose.model('programmingTask');
const UsersDB = mongoose.model('User');
const groupBD = mongoose.model('Group');
const {resError} = require('./../../helpres/ResultErrorGenerate');

const loadGroupTask =async (req,res,next) => {
    let {groupTaskId} = req.body;
    const groupTask = await groupTaskDB.findOne({
        $and: [
            { _id : groupTaskId },
            { group : req.user.group }
        ]
    });

    if (!groupTask) return resError(res, 'Ошибка при загрузке задания');
    req.groupTask = groupTask;
    next();
};

const loadGroup = async (req, res, next) => {
    const {group} = req.user.group;
    const resultGroup =await groupBD.findById(group);

    if (!resultGroup) return resError(res, 'Ошибка при загрузке группы');

    req.group = resultGroup;

    next
}

const loadUser = async (req, res,next) => {
    const {userid} = req;
    const user = await UsersDB.findById(userid);
    if (!user) return resError(res, 'Ошибка при загрузке пользователя');
    req.user = user;
    next();
}


const loadProgrammingTask =async (req,res,next) => {
    const {task} = req.groupTask;

    const programmingTask = await ProgramingTaskDB.findById(task);

    if (!programmingTask) return resError(res, 'Ошибка при загрузке задания');
    req.programmingTask = programmingTask;
    next();
};

module.exports.loadGroupTask = loadGroupTask;
module.exports.loadUser = loadUser;
module.exports.loadGroup = loadGroup;
module.exports.loadProgrammingTask = loadProgrammingTask;
