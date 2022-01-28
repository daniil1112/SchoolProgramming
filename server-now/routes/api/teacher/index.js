const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Users = mongoose.model('User');
const Groups = mongoose.model('Group');
const blockTest = mongoose.model('BlockOfTestes');

router.post('/newStudent', async (req,res) =>{
    // code = 1 -неверные входные параметры



    const group = Groups.findOne({
        $and: [
            {_id: req.body.group},
            {groupTeacher: req.userid}
        ]
    });
    // Проверка прав
    if (!group) return res.json({
        error: true,
        code : 2
    });

    const extendsUser =await Users.findOne({login:req.body.login});

    if (extendsUser){
        return res.json({
            error: true,
            code : 3
        });
    }

    const user = await new Users({
        name: req.body.name,
        login: req.body.login,
        password: req.body.password,
        lastip: '0.0.0.0',
        group: req.body.group,
        state: 1
    });



    try{
        await user.hashPassword()
        const savedUser = await user.save();
        if (savedUser) return res.json({
            group: group._id,
            success: true,
            successMessage: 'Пользователь добавлен в группу'
        })
    }
    catch (error) {
        //Catch errors
        await res.json({
            error: true,
            code : 4
        })
    }

});



router.post('/allGroups',async (req,res) =>{
    //check user status
    if (Users.findOne({_id:req.userid}).state === 1) return res.json({
        errors: true,
        errorMessage: 'Вы не создать группу'
    });

    const groups = await Groups.find({
        groupTeacher: req.userid
    });

    await res.json({
        groups: groups
    })
});

router.post('/loadGroupUsers',async (req,res) =>{
    //check user status
    if (Users.findOne({_id:req.userid}).state === 1) return res.json({
        errors: true,
        errorMessage: 'Вы не создать группу'
    });

    const group= await Groups.findOne({
        $and:[
            {_id: req.body.groupId},
            {groupTeacher: req.userid}
        ]
    });

    if (group){
        const users = await Users.find({group:req.body.groupId});
        await res.json({
            users:users
        })
    } else {
        await res.json({
            errors: true,
            errorMessage: "Не найдена группа"
        })
    }


});

router.post('addtest', async (req,res) =>{
    //check user status
    if (Users.findOne({_id:req.userid}).state === 1) return res.json({
        errors: true,
        errorMessage: 'Вы не создать группу'
    });

    const blockTestes = new blockTest({
        teacher: req.userid,
        testes: req.body.testes
    });

    try{
        const saved = blockTestes.save();
        if (saved) await res.json({
            saved: true
        });
        else res.json({
            saved:false,
            text:'Непредвиденная ошибка при добавлении блока тестов'
        })
    } catch (error) {
        await res.json({
            errors: true,
            errorMessage: error
        })
    }

});


router.use('/programming/', require('./programming'));
router.use('/grouptasks/', require('./groupTasks'));


module.exports = router;