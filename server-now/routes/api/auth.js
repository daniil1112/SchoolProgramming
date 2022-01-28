const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {loginValidation } = require('./../../validation');
const {check_auth, check_auth_get_user} = require("./../../middlewares");
const UserServiceClass = require("./../../services/user");
const UserDB = mongoose.model('User');

router.post('/login', async (req,res)=>{
    const UserService = new UserServiceClass;
    //validate
    const {error} = loginValidation(req.body);

    //error handler
    if (error) return res.json({
        error : true,
        code: 1,
    });

    //checking if user exist
    const user = await UserService.loadUserOrFail(req.body.login);

    //  if user isn't exist
    if (!user) return res.json({
        error : true,
        code: 2,
    });

    //checking password
    const validPassword = await UserService.checkPassword(req.body.password);

    if (!validPassword) return res.json({
        error : true,
        code: 2,
    });

    //generating auth_token
    try {
    await UserService.createJWT();
    const authStatus = await UserService.loginUser(req);
    if (authStatus) return res.json({
        errors: false,
        authToken: UserService.JWT,
        redirect: '/',
        user:{
            name: UserService.User.name,
            login: UserService.User.login,
            state: UserService.User.state
        }
    });
    } catch (e) {
        return res.json({
            error : true,
            code: 3,
        });
    }
});
router.post('/getUser',check_auth_get_user, async (req,res)=>{
    const user = await UserDB.findById(req.userid);
    if (req.refreshToken) {
        return res.json({
            refreshToken: req.refreshToken,
            user
        })
    }
    return res.json({user})
});


module.exports = router;