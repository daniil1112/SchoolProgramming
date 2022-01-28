const Joi = require("joi");
const {resError} = require('./../../helpres/ResultErrorGenerate');

const validateTaskId = (req, res, next) => {
    const {taskId} = req.body;
    if (!taskId || taskId<1) return resError(res, 'Входные параметры имели неверный формат');

    req.taskId = taskId;
    next()
};
const validateSetTaskLanguages = (req,res,next) => {
    const {taskId, languages} = req.body;
    const schema = {
        taskId: Joi.number().required(),
        languages: Joi.array().min(1).required()
    };
    let {error} = Joi.validate(req.body,schema);
    if (error) return resError(res, 'Входные параметры имели неверный формат');
    req.taskId = taskId;
    req.languages = languages
    next()
}


module.exports.validateTaskId = validateTaskId;
module.exports.validateSetTaskLanguages = validateSetTaskLanguages;