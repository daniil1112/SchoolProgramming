const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const Users = mongoose.model('User');
const jwt = require('jsonwebtoken');

class UserService {

    User = {};

    JWT = null;

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

    getUser(){
        return this.User
    }

    async checkPassword(password)
    {
        return await bcrypt.compare(password,this.User.password);
    }


    async createJWT()
    {
        const payload = {_id: this.User._id,};
        const token =await jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '5m'});
        this.JWT = token;
        if (token) return true
    }

    async loginUser(req)
    {

        this.User.lastip = req.connection.remoteAddress;
        const statusLogin = await Users.updateOne(this.User);
        return statusLogin
    }



}


module.exports = UserService;