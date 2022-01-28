const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {check_auth_teacher} = require("./../../../middlewares");

const groupDB = mongoose.model('Group');

router.post('/loadGroups',check_auth_teacher,async (req,res) => {
    const groups = await groupDB.find({groupTeacher : req.userid}).select('_id name');

    return res.json({
        groups
    })

});



module.exports = router;