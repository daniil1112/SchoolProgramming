const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {randomString} = require('../../helpres/random');

const task = mongoose.model('Task');

const {only_auth} = require("./../../middlewares");

router.post('/all',only_auth,async (req,res)=>{
    const tasks = await task.find();

    res.json({tasks: tasks});

});

router.post('/new',only_auth, async (req,res) =>{

    let slug = 'task'+await randomString(6);
    if (task.findOne({slug: slug}))  slug = 'task'+await randomString(6);

    const currentTask = await new task({
        creator: req.userid,
        shortTitle: req.body.shortTitle,
        title: req.body.title,
        body: req.body.body,
        slug: slug
    });

    await currentTask.save();

    //TODO redirect to add tests!!!
    await res.json({task: currentTask});
});

module.exports = router;