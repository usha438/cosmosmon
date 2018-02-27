//Requiring Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Conversation = require('../models/conversationModel');
const Joi = require('joi');

//Defining Schema
var botSchema = mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  org: {
    type: String,
    lowercase: true,
    required: true
  },
  framework: {
    type: String,
    required: true
  },
  cleanUpAfterDays: {
    type: Number,
    default: null
  },
  cleanUpOlderThan: {
    type: Number,
    default: null
  },
  description: {
    type: String
  },
  referenceID: {
    type: String,
    required: true
  },
  customSettings: {
    type: Schema.Types.Mixed,
    default: null
  },
  conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }]
},
{
  timestamps: true
});

botSchema.index({ "name": 1, "org": 1}, { "unique": true });

//Exporting the file
module.exports = mongoose.model('Bot', botSchema); //Binding schema toConvoCollection
