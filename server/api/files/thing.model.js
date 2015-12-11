'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProcessedFileSchema = new Schema({
  name: String,
  time: String,
  processed: Boolean
});

module.exports = mongoose.model('ProcessedFile', ProcessedFileSchema);