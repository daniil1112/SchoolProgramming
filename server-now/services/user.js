const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const Users = mongoose.model('User');
const jwt = require('jsonwebtoken');

class UserService {

    constructor() {
        this.User = {};
        this.JWT = null
    }

    async  loadUserOrFail(login)
    {
        const user = await Users.findOne({login});
        if (user)
        {
            this.User=user;
            return true
        }
        return false;
    }
    async loginUser(req)
    {
        let ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        this.User.lastip = ip;
        return await this.User.update({lastip: ip})
    }

    async checkPassword(password)
    {
        return await bcrypt.compare(password,this.User.password);
    }


    async createJWT()
    {
        const payload = {_id: this.User._id,};
        const token =await jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '1h'});
        this.JWT = token;
        if (token) return true
    }
}


module.exports = UserService;