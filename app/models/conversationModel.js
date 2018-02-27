//Requiring Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bot = require('../models/botModel');

//Defining Schema
var convoSchema = mongoose.Schema({

  user: [],
  channel: {
    type: String,
    required: true
  },
  conversationID: {
    type: String,
    required: true
  },
  ended: {
    type: Boolean,
    default: false
  },
  abandoned: {
    type: Boolean,
    default: false
  },
  totalMessages: {
    type: Number,
    default: 1
  },
  miscData: {
    type: Schema.Types.Mixed,
    default: null
  },
  owner: { type: Schema.Types.ObjectId, ref: 'Bot' },
  messages:[]

},{
  timestamps: true
});

//Exporting the file
module.exports = mongoose.model('Conversation', convoSchema); //Binding schema toConvoCollection


/*
{ conversationID: 'i9c5aibj7442',
timestamp: '2018-01-19T19:24:43.518Z',
channel: 'emulator',
text: 'Hi, I’m the IPG Help Desk Assistant – How can I help you?',
user: { id: 'default-user', name: 'User' },
origin: 'bot',
type: 'message' }
*/
