const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Users = mongoose.model('User');

const only_auth = async (req,res,next) => {
    const authheader = req.headers['authtoken'];
    const token = authheader && authheader.split(' ')[1];

    if(!token) return res.sendStatus(401);


    try {
        user = await jwt.verify(token,process.env.TOKEN_SECRET);
        if (user) req.userid = user._id;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError")
        {
            //Обновление токена
            const user = jwt.decode(token,process.env.TOKEN_SECRET);

            // Поиск пользователя с данным ip
            const Dbuser =await Users.findOne({
                $and: [
                    {_id: user._id},
                    {lastip: req.connection.remoteAddress}
                ]
            });
            if (Dbuser)
            {
                var refreshedToken = await jwt.sign({_id: Dbuser._id}, process.env.TOKEN_SECRET, {expiresIn: '5m'});
                return res.json({refreshToken: refreshedToken});
            } else {
                return res.json({refreshToken: ''});
            }

        } else {
            res.sendStatus(403).json({refreshToken: ''});
        }
    }

};

const check_auth = async (req,res,next) => {
    const authheader = req.headers['authtoken'];
    const token = authheader && authheader.split(' ')[1];

    if(!token) return res.json({});

    else {
    try {
        user = await jwt.verify(token,process.env.TOKEN_SECRET);
        if (user) req.userid = user._id;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            //Обновление токена
            const user = jwt.decode(token, process.env.TOKEN_SECRET);

            // Поиск пользователя с данным ip
            const Dbuser = await Users.findOne({
                $and: [
                    {_id: user._id},
                    {lastip: req.connection.remoteAddress}
                ]
            });
            if (Dbuser) {
                var refreshedToken = await jwt.sign({_id: Dbuser._id}, process.env.TOKEN_SECRET, {expiresIn: '5m'});
                return res.json({refreshToken: refreshedToken});
            } else {
                return res.json({refreshToken: ''});
            }

        } else {
            res.json({refreshToken: ''});
        }
    }
    }

};
module.exports.only_auth = only_auth;
module.exports.check_auth = check_auth;