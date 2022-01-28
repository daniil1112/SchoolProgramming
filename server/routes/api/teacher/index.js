const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {only_auth} = require("./../../../middlewares");
const Users = mongoose.model('User');
const Groups = mongoose.model('Group');
const blockTest = mongoose.model('BlockOfTestes');

router.post('/newStudent',only_auth, async (req,res) =>{

    //check user status
    if (Users.findOne({_id:req.userid}).state === 1) return res.json({
        errors: true,
        errorMessage: 'Вы не моете добавить нового ученика'
    });

    const group = Groups.findOne({
        $and: [
            {_id: req.body.group},
            {groupTeacher: req.userid}
        ]
    });
    // Проверка прав
    if (!group) return res.json({
        errors: true,
        errorMessage: 'Вы не можете добавить ученика в данную группу'
    });

    const user = await new Users({
        name: req.body.name,
        login: req.body.login,
        password: req.body.password,
        lastip: req.connection.remoteAddress,
        group: req.body.group,
        state: 1
    });



    try{
        const savedUser = await user.save();
        if (savedUser) return res.json({
            success: true,
            successMessage: 'Пользователь добавлен в группу'
        })
    }
    catch (error) {
        //Catch errors
        await res.json({
            errors: true,
            errorMessage: error
        })
    }

});

router.post('/addGroup',only_auth,async (req,res) =>{
    //check user status
    if (Users.findOne({_id:req.userid}).state === 1) return res.json({
        errors: true,
        errorMessage: 'Вы не создать группу'
    });


    const group = await new Groups({
        groupTeacher: req.userid,
        name: req.body.name
    });

    try {
        const saved = await group.save();
        if (saved) return res.json({
            success: true,
            successMessage: "Группа успешно создана"
        });
        else res.json({
            errors: true,
            errorMessage: "Непредвиденная ошибка при добавлении группы"
        })
    } catch (e) {
        await res.json({
            errors: true,
            errorMessage: "Ошибка при добавлении группы"
        })
    }
});

router.post('/allGroups',only_auth,async (req,res) =>{
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

router.post('/loadGroupUsers',only_auth,async (req,res) =>{
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

router.post('addtest',only_auth, async (req,res) =>{
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


module.exports = router;