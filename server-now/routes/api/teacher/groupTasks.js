const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth_teacher} = require("./../../../middlewares");
const {resError} = require('../../../helpres/ResultErrorGenerate');

const groupTaskDB = mongoose.model('groupTask');


router.post('/counter', check_auth_teacher, async (req,res) => {
    let {group} = req.body;
    if (!group) return resError(res, 'Группа не задана')

    const counter = await groupTaskDB.count({group: group})
    return res.json({counter: counter})
})

router.post('/all' ,check_auth_teacher, async (req,res) => {
    let {group} = req.body;
    if (!group) return resError(res, 'Группа не задана')

    const tasks = await groupTaskDB.find({group: group}).sort( '-_id' )
    return res.json({tasks: tasks})
})
router.post('/someTasks' ,check_auth_teacher, async (req,res) => {
    let {group,pp} = req.body;
    if (!group || !pp) return resError(res, 'Входные параметры имеют ошибку!')

    const tasks = await groupTaskDB.find({group: group})
        .limit( pp )
        .sort( '-_id' )
    return res.json({tasks: tasks})
})


module.exports = router;