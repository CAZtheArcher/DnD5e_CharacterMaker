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
  level: {
    type: Number,
    min: 1,
    required: true,
  },
  race: {
    type: String,
    required: true,
    trim: true,
  },
  background: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    required: true,
    trim: true,
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
  proficiencies: {
    type: String[String],
    required: true,
    trim: true,
  },
  spells: {
    type: String[String[String]],
    required: false,
    trim: true,
  },
  items: {
    type: String[String],
    required: false,
    trim: true,
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
  race: doc.race,
  level: doc.level,
  class: doc.class,
  background: doc.background,
  str: doc.str,
  dex: doc.dex,
  con: doc.con,
  wis: doc.wis,
  int: doc.int,
  cha: doc.cha,
  proficiencies: doc.proficiencies,
});

const CharacterModel = mongoose.model('Character', CharacterSchema);
module.exports = CharacterModel;
