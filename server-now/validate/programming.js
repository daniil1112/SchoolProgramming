const Joi = require("joi");
const {resError} = require('./../helpres/ResultErrorGenerate');

const validateTaskId = (req,res,next) => {
    let {taskId} = req.body;
    const schema = {
        taskId: Joi.number().required(),
    };
    let {error} = Joi.validate(req.body,schema);
    if (error) return resError(res, 'Входные параметры имели неверный формат');
    req.taskId = taskId;
    next()
};

const validateAddResolveAttemp = (req,res,next) => {
    const {program, programLang, taskId} = req.body;
    //TODO валидация доступных языков
    if (!program || !programLang || !taskId) return resError(res, 'Входные параметры имели неверный формат');

    const schema = {
        program: Joi.string().min(2).required(),
        programLang: Joi.number().min(1).required(),
        taskId: Joi.number().required(),
    };

    let {error} = Joi.validate(req.body,schema);
    if (error) return resError(res, 'Входные параметры имели неверный формат');
    req.program = program;
    req.programLang = programLang;
    req.taskId = taskId;
    next()
};

const validateLoadLangsForTask = (req, res, next) => {
    const {groupTaskId, langs} = req.body;

    const schema = {
        groupTaskId: Joi.number().min(1).required(),
        langs: Joi.array().items(Joi.number().min(1).required()).required()
    }

    let {error} = Joi.validate(req.body,schema);
    if (error) return resError(res, 'Входные параметры имели неверный формат');

    req.groupTaskId = groupTaskId;
    req.langs = langs;
    next()
}




module.exports.validateTaskId = validateTaskId;
module.exports.validateAddResolveAttemp=validateAddResolveAttemp
module.exports.validateLoadLangsForTask=validateLoadLangsForTask

