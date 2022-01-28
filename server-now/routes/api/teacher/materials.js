const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth_teacher} = require("./../../../middlewares");

const materialsInDb = mongoose.model('material');

router.post('/addMaterial', check_auth_teacher, async (req,res)=> {
    const result = await materialsInDb.create({
        user: req.userid,
        text: req.body.text,
        title: req.body.title
    });
    return  res.json({result})
});

router.post('/loadMaterials', check_auth_teacher, async (req,res)=> {
    const materials = await materialsInDb.find({
        user: req.userid,
    });
    return  res.json({materials})
});


module.exports = router;