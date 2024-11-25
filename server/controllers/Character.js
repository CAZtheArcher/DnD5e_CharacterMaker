const models = require('../models');

const Char = models.Character;

const makerPage = async (req, res) => res.render('app');

const makeCharacter = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.level || !req.body.race || !req.body.class) {
      return res.status(400).json({ error: 'Name, age, and race, class, and level are all required!' });
    }
  
    const charData = {
      name: req.body.name,
      age: req.body.age,
      power: req.body.power,
      owner: req.session.account._id,
    };
  
    try {
      const newChar = new Character(charData);
      await newChar.save();
      return res.status(201).json({ name: newChar.name, age: newChar.age, power: newChar.power });
    } catch (err) {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Character already exists!' });
      }
      return res.status(500).json({ error: 'An unexpected error has occured!' });
    }
};

const getCharacter = async (req, res) => {
    try {
      const query = { owner: req.session.account._id };
      const docs = await Char.find(query).select('name age power').lean().exec();
  
      return res.json({ characters: docs });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error retrieving characters!' });
    }
};

const deleteCharacter = async (req, res) => {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name of character to remove is required!' });
    }
    const deletedChars = await Char.deleteOne({ name: req.body.name });
  
    return res.status(200).json({ deleteCount: deletedChars.deletedCount });
};

module.exports = {
    makerPage,
    makeCharacter,
    getCharacter,
    deleteCharacter,
}