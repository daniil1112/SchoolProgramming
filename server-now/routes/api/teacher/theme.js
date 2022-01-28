const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth_teacher} = require("./../../../middlewares");

const datalize = require('datalize')
const field = datalize.field;

const {resError} = require('../../../helpres/ResultErrorGenerate');

const themeDB = mongoose.model('theme')


router.post('/add',datalize([
    field('text').trim().required(),
    field('form').trim().int().required().range(1, 11),
    field('details').default(''),
]), check_auth_teacher, async (req, res) => {

    const {form} = req

    if (!form.isValid) return resError(res, 'Ошибка входных параметров')

    const theme = await themeDB.create({
        text: form.text,
        form: form.form,
        details: form.details,
        teacher: req.userid
    })

    if (theme) return res.json({
        theme
    })

    return resError(res, 'Неизвестная ошибка при создании')

})

router.post('/loadAll', check_auth_teacher, async (req, res) => {


    const themes = await themeDB.find({
        teacher: req.userid
    })

    if (themes) return res.json({
        themes
    })

    return resError(res, 'Неизвестная ошибка при загрузке')

})

router.post('/load', check_auth_teacher,
    datalize([
        field('_id').required().int()
    ]), async (req, res) => {

    const {form} = req

    if (!form.isValid) return resError(res, 'Ошибка входных параметров')


    const theme = await themeDB.findById(form._id)

    if (theme) return res.json({theme})

    return resError(res, 'Неизвестная ошибка при загрузке')

})


module.exports = router;