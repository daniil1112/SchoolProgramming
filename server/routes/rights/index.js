const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {only_auth} = require("./../../middlewares");

const Users = mongoose.model('User');
const Groups = mongoose.model('Group');

router.post('/createTask',only_auth,(req,res) =>{
    const user = Users.findOne({_id: req.userid});
    //Права(либо отдельный кластер, либо как-то через цифры)
    res.json({
        access: true
    })

});

router.post('/UpdateGroup', only_auth, async (req,res) =>{
    const group = await Groups.findOne({
        $and: [
            {_id: req.body.groupId},
            {groupTeacher: req.userid}

        ]});
    if (group) {
        await res.json({access: true})
    } else {
        await res.sendStatus(404);
    }
});

router.post('/AllGroups',only_auth,async (req,res) =>{
    const user = await Users.findOne({_id: req.userid});

    if (user.state === 1){
        res.sendStatus(404); //Запрет на просмотр классов учеников
    } else {
        res.json({access: true})
    }
});

module.exports = router;
