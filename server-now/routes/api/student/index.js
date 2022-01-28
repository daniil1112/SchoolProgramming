const express = require("express");
const router = express.Router();

router.use('/programming/',require('./programming'));
router.use('/tests/',require('./tests'));
router.use('/lesson/',require('./lesson'));
router.use('/tasks/',require('./tasks'));
router.use('/materials/',require('./materials'));
router.use('/reports/',require('./reports'));

module.exports = router;