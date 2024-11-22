const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  str: {
    type: Number,
    min: 0,
    required: true,
  },
  dex: {
    type: Number,
    min: 0,
    required: true,
  },
  con: {
    type: Number,
    min: 0,
    required: true,
  },
  wis: {
    type: Number,
    min: 0,
    required: true,
  },
  int: {
    type: Number,
    min: 0,
    required: true,
  },
  cha: {
    type: Number,
    min: 0,
    required: true,
  },
  spells: {
    type: String[String[String]],
    required: true,
    trim: true,
    set: setName,
  },
  items: {
    type: String[String],
    required: true,
    trim: true,
    set: setName,
  },
  proficiencies: {
    type: String[String],
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

CharacterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  str: doc.str,
  dex: doc.dex,
  con: doc.con,
  wis: doc.wis,
  int: doc.int,
  cha: doc.cha,
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
