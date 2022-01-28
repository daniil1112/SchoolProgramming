const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth_teacher} = require("./../../../middlewares");

const {resError} = require('../../../helpres/ResultErrorGenerate');


const Users = mongoose.model('User');
const groupTaskBD = mongoose.model('groupTask');
const BlockOfTestesReportBD = mongoose.model('BlockOfTestesReport');
const programmingReportBD = mongoose.model('report');
const groupsBD = mongoose.model('Group');

router.post('/counter', check_auth_teacher, async (req,res) => {
    try{
        const counter = await groupsBD.count({
            groupTeacher: req.userid
        })

        return res.json({counter})
    } catch (e) {
        return resError(res, 'Ошибка при загрузке')
    }

})
router.post('/all',check_auth_teacher, async(req, res)=>{
    try{
        const groups = await groupsBD.find({
            groupTeacher: req.userid
        }).sort('-_id');

        return res.json({groups})
    } catch (e) {
        return resError(res, 'Ошибка при загрузке групп')
    }

});

router.post('/addGroup',check_auth_teacher , async (req,res) =>{
    //check user status
    let {name, form} = req.body

    if (!name || name.length < 3) return resError(res,'Входные параметры имели неверный формат')

    let group
    if (form) {
        group = new groupsBD({
            groupTeacher: req.userid,
            name,
            form
        });
    } else {
        group = new groupsBD({
            groupTeacher: req.userid,
            name
        });
    }

    try {
        const saved = await group.save();
        if (saved) return res.json({group: saved});
        return resError(res, 'Непредвиденная ошибка при добавлении группы');
    } catch (e) {
        return resError(res, 'Непредвиденная ошибка при добавлении группы');
    }
});
router.post('/loadReports',check_auth_teacher, async (req,res)=>{
    let groupTaskID = req.body.task;

    let groupTask = await groupTaskBD.findById(groupTaskID);

    let groupId = req.body.group;

    let students =await Users.find({
        group: groupId
    }).select('_id group name');

    let studentIDS = [];

    students.forEach(student => studentIDS.push(student._id));

    console.log(studentIDS)

    let reports;

    if (groupTask.type === 1) {
        reports =await BlockOfTestesReportBD.find({
            $and:[
                {user: {$in : studentIDS }},
                {task: groupTaskID}
            ]
        })
    } else if (groupTask.type === 2){
        reports =await programmingReportBD.find({
            $and:[
                {user: {$in : studentIDS }},
                {task: groupTask._id}
            ]
        })
        console.log(reports)
    }


    return res.json({
        groupTask,studentIDS,reports
    })
});


router.post('/loadGroupTask',check_auth_teacher, async (req,res)=>{
    let taskId = req.body.task;

    let groupTask = await groupTaskBD.findById(taskId);

    return res.json({
        groupTask
    })
});


router.post('/loadGroupUsers',check_auth_teacher, async (req,res) =>{

    let {groupId} = req.body

    if (!groupId) return resError(res, 'Входные параметры имели неверный формат')

    const group= await groupsBD.findOne({
        $and:[
            {_id: groupId},
            {groupTeacher: req.userid}
        ]
    });
    if (!group ) return resError(res, 'Группа не загрузилась')

    try {
        const users = await Users.find({group:req.body.groupId}).select('lastip login name _id group');
        return  res.json({users})
    } catch (e) {
        return resError(res, 'Непредвиденная ошибка при загрузке учеников');
    }



});

router.post('/deleteStudent',check_auth_teacher, async (req,res) =>{
    //code 1 => НЕверные входные данные

    let student,group,result;

    student = await Users.findById(req.body.userId);
    
    if (!student || !student.group) return res.json({
        error: true,
        code: 2
    });

    //Это проверка возможности учиеля изменять группу
    group = await groupsBD.findOne({
        $and:[
            {groupTeacher: req.userid},
            {_id: student.group}
        ]

    });

    if (!group) return res.json({
        error: true,
        code: 3
    });

    try {
        result = await student.delete();
        if (!result) return res.json({
            error: true,
            code: 4
        });
    } catch (e) {
        return res.json({
            error: true,
            code: 4
        });
    }

    return res.json({
        success: true
    });

});


// router.post('/updateStudent',check_auth_teacher, async (req,res) =>{
//     //code 1 => НЕверные входные данные
//
//     let student,group,result;
//
//     let updatePassword = req.body.updatePassword;
//
//     student = await Users.findById(req.body.userId);
//
//     if (!student || !student.group) return res.json({
//         error: true,
//         code: 2
//     });
//
//     //Это проверка возможности учиеля изменять группу
//     group = await groupsBD.findOne({
//         $and:[
//             {groupTeacher: req.userid},
//             {_id: student.group}
//         ]
//
//     });
//
//     if (!group) return res.json({
//         error: true,
//         code: 3
//     });
//
//     if (updatePassword){
//         //Валидация пароля
//         student.name = req.body.name;
//         student.login = req.body.login;
//         student.password = req.body.password;
//         try {
//             result =await student.save();
//             if (!result){
//                 return res.json({
//                     error: true,
//                     code: 4
//                 });
//             }
//         } catch (e) {
//             return res.json({
//                 error: true,
//                 code: 4
//             });
//         }
//     } else {
//         try {
//             result =await student.update({
//                 name: req.body.name,
//                 login: req.body.login
//             });
//             if (!result){
//                 return res.json({
//                     error: true,
//                     code: 4
//                 });
//             }
//         } catch (e) {
//             return res.json({
//                 error: true,
//                 code: 4
//             });
//         }
//
//     }
//
//
//     return res.json({
//         success: true
//     })
//
// });


router.post('/updateStudent', check_auth_teacher, async (req,res) => {
    //TODO доп валидация
    let {name, login, password, changeGroup, changePassword , group, _id} = req.body
    if (!name || !login ) return resError(res, 'Логин или пароль неверны')
    if (!password && changePassword) return resError(res, 'Пароль имеет неверный формат')

    const countUsers = await Users.find({login}).count()

    if (countUsers > 1) return resError(res, 'Логин занят')

    if (changeGroup) {
        const group = await groupsBD.findOne({groupTeacher: req.userid})
        if (!group) return resError(res, 'У вас нет доступа к группе, которую вы установили')
    }
    //TODO Проверка доступа к изначальной группе

    const student = await Users.findById(_id)

    if (!student) return resError(res, 'Ученик не найден')

    student.name = name
    student.login = login
    if (changePassword) {
        student.password = password
        await student.hashPassword()
    }
    if (changeGroup) student.group = group

    try {
        const resStudent = await student.save()
        if (!resStudent) return resError(res, 'Ошибка при сохранении ученика')
        return res.json({
            student: resStudent,
            changeGroup
        })
    } catch (e) {
        resError(res, 'Неизвестная ошибка при сохранении')
    }
})


router.post('/changeStudentGroup',check_auth_teacher, async (req,res) =>{
    //code 1 => НЕверные входные данные

    let student,group,result;

    let newGroup = req.body.newGroup;

    student = await Users.findById(req.body.userId);

    if (!student || !student.group) return res.json({
        error: true,
        code: 2
    });

    //Это проверка возможности учиеля изменять группу
    group = await groupsBD.findOne({
        $and:[
            {groupTeacher: req.userid},
            {_id: student.group}
        ]

    });

    if (!group) return res.json({
        error: true,
        code: 3
    });

    let newGroupModel = await groupsBD.findOne({
        $and:[
            {groupTeacher: req.userid},
            {_id: newGroup}
        ]

    });

    if (!newGroupModel) return res.json({
        error: true,
        code: 4
    });

    try {
        result = await student.update({
            group: newGroup
        });
        if (!result){
            return res.json({
                error: true,
                code: 5
            });
        }
    } catch (e) {
        return res.json({
            error: true,
            code: 5
        });
    }

    return res.json({
        success: true
    });

});


router.post('/delete', check_auth_teacher, async (req, res) => {
    const {groupId} = req.body
    const group = await groupsBD.findOne({
        _id:groupId,
        groupTeacher: req.userid
    });

    if (!group) return resError(res, 'Ошибка при загрузке группы')

    try {
        await Users.remove({group:req.body.groupId})
        await group.remove()
        return res.json({})
    } catch (e) {
        return resError(res, 'Ошибка при удалении')
    }

})


module.exports = router;