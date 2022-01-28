const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Users = mongoose.model('User');



const check_auth = async (req,res,next) => {
    const token = req.headers['authorization'];

    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

    if (!token) return res.json({});

    else {
        try {
            user = await jwt.verify(token, process.env.TOKEN_SECRET);
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
                        {lastip: ip}
                    ]
                });
                if (Dbuser) {
                    var refreshedToken = await jwt.sign({_id: Dbuser._id}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
                    return res.json({refreshToken: refreshedToken});
                } else {
                    return res.json({refreshToken: ''});
                }

            } else {
                return res.json({refreshToken: ''});
            }
        }
    }
};

const check_auth_get_user = async (req,res,next) => {
    const token = req.headers['authorization'];

    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

    if (!token) return res.json({});

    else {
        try {
            user = await jwt.verify(token, process.env.TOKEN_SECRET);
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
                        {lastip: ip}
                    ]
                });
                if (Dbuser) {
                    let refreshedToken = await jwt.sign({_id: Dbuser._id}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
                    req.refreshToken = refreshedToken;
                    req.userid = user._id;
                    next()
                    // return res.json({refreshToken: refreshedToken});
                } else {
                    return res.json({refreshToken: ''});
                }

            } else {
                return res.json({refreshToken: ''});
            }
        }
    }
};

    const check_auth_teacher = async (req,res,next) => {
        const token = req.headers['authorization'];
        let ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        if(!token) return res.json({});

        else {
            try {
                let user = await jwt.verify(token,process.env.TOKEN_SECRET);
                if (user) {
                    req.userid = user._id;
                    const teacher =await Users.findById(user._id);
                    if (teacher.state>=2) next();
                    else return res.json({redirect: '/login'});
                }


            } catch (error) {

                if (error.name === "TokenExpiredError") {
                    //Обновление токена
                    const user = jwt.decode(token, process.env.TOKEN_SECRET);

                    // Поиск пользователя с данным ip
                    const Dbuser = await Users.findOne({
                        $and: [
                            {_id: user._id},
                            {lastip: ip}
                        ]
                    });



                    if (Dbuser) {
                        let refreshedToken = await jwt.sign({_id: Dbuser._id}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
                        return res.json({refreshToken: refreshedToken});
                    } else {
                        return res.json({refreshToken: ''});
                    }

                } else {
                    return res.json({refreshToken: ''});
                }
            }
        }
};


const check_auth_admin = async (req,res,next) => {
    const token = req.headers['authorization'];
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

    if(!token) return res.json({});

    else {
        try {
            let user = await jwt.verify(token,process.env.TOKEN_SECRET);
            if (user) {
                req.userid = user._id;
                const teacher =await Users.findById(user._id);
                if (teacher.state===4) next();
                else return res.json({redirect: '/login'});
            }


        } catch (error) {
            if (error.name === "TokenExpiredError") {
                //Обновление токена
                const user = jwt.decode(token, process.env.TOKEN_SECRET);

                // Поиск пользователя с данным ip
                const Dbuser = await Users.findOne({
                    $and: [
                        {_id: user._id},
                        {lastip: ip}
                    ]
                });
                if (Dbuser) {
                    let refreshedToken = await jwt.sign({_id: Dbuser._id}, process.env.TOKEN_SECRET, {expiresIn: '1h'});
                    return res.json({refreshToken: refreshedToken});
                } else {
                    return res.json({refreshToken: ''});
                }

            } else {
                return res.json({refreshToken: ''});
            }
        }
    }
};
module.exports.check_auth = check_auth;
module.exports.check_auth_get_user = check_auth_get_user;
module.exports.check_auth_teacher = check_auth_teacher;
module.exports.check_auth_admin = check_auth_admin;

