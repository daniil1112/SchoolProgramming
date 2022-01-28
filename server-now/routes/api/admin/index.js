const express = require("express");
const router = express.Router();
const {check_auth_admin} = require("./../../../middlewares");

router.use(check_auth_admin);
router.use('/programming/',require('./programming'));




module.exports = router;