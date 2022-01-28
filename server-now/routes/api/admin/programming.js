const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
require('./../../../models/programAttemp');
const ProgramAttemps = mongoose.model('programAttempt');


let success = false;

router.post('/loadProgrammingAttemps',async (req,res)=>{
    const PerPage =10;
    const result = await ProgramAttemps.find()
        .limit(PerPage)
        .skip((req.body.page-1)*PerPage)
        .sort({
            _id: "DESC"
        });

    await res.json({attemps: result});
});

router.post('/reloadAttemp',async (req,res) =>{
    const attemp =  await ProgramAttemps.findById(req.body.attemp);
    attemp.status = "waiting";
    const result = await attemp.save();

    if (result) success=true;
    await res.json({
        success
    });
});
router.post('/deleteAttemp',async (req,res) =>{
    const attemp =  await ProgramAttemps.findById(req.body.attemp);
    const result = attemp.delete();
    if (result) success=true;
    await res.json({
        success
    })
});

router.post('/countAttemps',async (req,res) =>{
    const count = await ProgramAttemps.countDocuments({});
    await res.json({
        count
    })
});



module.exports = router;