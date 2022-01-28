const express = require("express");
const router = express.Router();

router.use('/auth/', require('./auth'));
router.use('/tasks/',require('./tasks'));
router.use('/teacher/',require('./teacher'));

module.exports = router;