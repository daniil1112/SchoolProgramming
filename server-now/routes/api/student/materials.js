const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {check_auth} = require("./../../../middlewares");


const materialsInDb = mongoose.model('material');

router.post('/load',check_auth, async (req,res) =>{
    const result = await materialsInDb.findById(req.body.id);

    return res.json({result})
});

module.exports = router;