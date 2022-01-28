const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {loginValidation } = require('./../../validation');
const jwt = require('jsonwebtoken');
const {check_auth} = require("./../../middlewares");
const UserServiceClass = require("./../../services/user");
const Users = mongoose.model('User');

router.post('/login', async (req,res)=>{
    const UserService = new UserServiceClass;
    //validate
    const {error} = loginValidation(req.body);

    //error handler
    if (error) return res.status(200).json({
        errors : true,
        errorMessage: error.details[0].message,
    });

    //checking if user exist
    const user = await UserService.loadUserOrFail(req.body.login);

    //  if user isn't exist
    if (!user) return res.json({
        errors : true,
        errorMessage: "Login or password is wrong",
    });

    //checking password
    const validPassword = await UserService.checkPassword(req.body.password);

    if (!validPassword) return res.json({
        errors : true,
        errorMessage: "Login or password is wrong",
    });

    //generating auth_token
    await UserService.createJWT();
    const authStatus = await UserService.loginUser(req);
    if (authStatus) res.json({
        errors: false,
        authToken: UserService.JWT,
        redirect: '/',
        user:{
            name: UserService.User.name,
            login: UserService.User.login,
            state: UserService.User.state
        }
    });
});

router.post('/profileHeader', async (req,res) =>{
    const authheader = req.headers['authtoken'];
    const token = authheader && authheader.split(' ')[1];

    if(!token) return res.json({auth: 'false'});


    try {
        user = await jwt.verify(token,process.env.TOKEN_SECRET);
        if (user) req.userid = user._id;
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
                return res.sendStatus(200).json({refreshToken: ''});
            }

        } else {
            res.json({refreshToken: ''});

        }
    }

    const UserModel =await Users.findOne({_id: req.userid});

    if (UserModel) await res.json({
        name: UserModel.name,
    })
});
router.post('/getUser',check_auth, async (req,res)=>{
    const user = await Users.findOne({_id: req.userid});
      res.json({
         user: {
             name: user.name,
             state: user.state
         }
     })
});


module.exports = router;