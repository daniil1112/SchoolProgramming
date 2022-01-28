var crypto = require('crypto');


const randomString = async function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len).toUpperCase();   // return required number of characters
};

module.exports = {
    randomString
}


