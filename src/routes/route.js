const express = require('express');

const urlController=require('../contorllers/urlController');

const router = express.Router();


router.post('/url/shorten', urlController.urlShort);
router.get('/:urlCode', urlController.urlCode)


module.exports = router;