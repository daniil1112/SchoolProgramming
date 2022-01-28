const Joi = require("joi");
const {resError} = require('./../../helpres/ResultErrorGenerate');

const validateTemplateToAddStudentAttemp = (req, res, next) => {
    const {taskId, programmingTextTemplate} = req.body;

    const schema = {
        programmingTextTemplate: Joi.array().required(),
        groupTaskId: Joi.number().required()
    }

    let {error} = Joi.validate(req.body,schema);
    console.log(error)
    if (error) return resError(res, 'Входные параметры имели неверный формат');

    req.taskId = taskId;
    req.programmingTextTemplate = programmingTextTemplate;
    next()
}


module.exports.validateTemplateToAddStudentAttemp = validateTemplateToAddStudentAttemp;