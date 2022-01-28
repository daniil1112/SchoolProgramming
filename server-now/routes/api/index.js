const express = require("express");
const router = express.Router();

router.use('/auth/', require('./auth'));
router.use('/teacher/',require('./teacher'));
router.use('/teacher/programming',require('./teacher/programming'));
router.use('/student/',require('./student'));
router.use('/admin/',require('./admin'));
router.use('/teacher/tests',require('./teacher/tests'));
router.use('/teacher/materials',require('./teacher/materials'));
router.use('/teacher/students',require('./teacher/students'));
router.use('/teacher/lessons',require('./teacher/lessons'));
router.use('/teacher/groups',require('./teacher/groups'));
router.use('/teacher/theme',require('./teacher/theme'));

module.exports = router;