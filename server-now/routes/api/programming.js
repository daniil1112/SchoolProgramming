const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth} = require("./../../middlewares");

const ProgramLangsDB = mongoose.model('ProgrammingLangs');

router.get('/loadLangs',check_auth, async (req,res) =>{
    const langs = await ProgramLangsDB.find({ active: true});

    return res.json({ langs })
});