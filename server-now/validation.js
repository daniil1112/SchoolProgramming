const Joi = require("joi");


const registerValidation = (data) => {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    };

    return Joi.validate(data,schema);
};


const loginValidation = data => {
    const schema = {
        login: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(6).required(),
    };

    return Joi.validate(data,schema);
};

const firstStepProgramTask = (data) => {
    const schema = {
        title: Joi.string().min(3).max(50).required(),
        task: Joi.string().min(10).max(2000).required(),
    };

    return Joi.validate(data,schema);
};


const secondStepProgramTask = (data) => {
    const schema = {
        program: Joi.string().min(10).max(10000).required(),
        programLang: Joi.number().integer().required(),
    };

    return Joi.validate(data,schema);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.firstStepProgramTask = firstStepProgramTask;
module.exports.secondStepProgramTask = secondStepProgramTask;