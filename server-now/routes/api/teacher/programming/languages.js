const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const {resError} = require('../../../../helpres/ResultErrorGenerate');

const ProgrammingLangsDB = mongoose.model('ProgrammingLangs')


const {check_auth_teacher} = require("./../../../../middlewares");

const {loadTask, loadSolvedAttemp} = require("./../../../../middleware/teacher/programming");

const {validateTaskId, validateSetTaskLanguages} = require("./../../../../validate/teacher/programming");


router.get('/load', check_auth_teacher, async (req,res) => {
    const languages = await ProgrammingLangsDB.find({
        active: true
    })

    let result = [];
    languages.forEach( e => {
        result.push({
            active:e.active,
            label:e.label,
            prism:e.prism,
            _id:e._id,
            value:e.value
        })
    })

    return res.json({languages})
})

router.post('/taskDefault', check_auth_teacher , validateTaskId, loadTask, loadSolvedAttemp, async (req, res) => {
    return res.json({defaultLanguage: req.solvedAttemp.programLang})
})

router.post('/settask',check_auth_teacher, validateSetTaskLanguages, loadTask, loadSolvedAttemp, async (req,res) => {
    let {task,languages} = req
    if (task.type === 2 ) return resError(res,'Языки заданий данного формата нельзя менять');
    if (!languages.some( e => e === req.solvedAttemp.programLang)) return resError(res,'Удаление стандартного языка запрещено!!!');

    task.langs = languages;

    const savedTask = await task.save();

    if (!savedTask) return resError(res,'Задача не сохранена');

    return res.json({})

});


module.exports = router;