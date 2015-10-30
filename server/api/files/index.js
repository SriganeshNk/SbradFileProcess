'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/getFiles', controller.getFiles);
router.post('/', controller.upload);
router.post('/transformFile', controller.transformFile);
router.post('/deleteFile', controller.deleteFile);
router.delete('/:id', controller.destroy);

module.exports = router;