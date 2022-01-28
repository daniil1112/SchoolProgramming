const resError = (res,message, options = {}) => {
    let code,fields,hash = null;
    if (options.code) code = options.code;
    if (options.fields) fields = options.fields;
    if (options.hash) hash = options.hash;
    return res.json ({ error: true, errorMessage: message, code, fields, hash});
};

module.exports.resError = resError;