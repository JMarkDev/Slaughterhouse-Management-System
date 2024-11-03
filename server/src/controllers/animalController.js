const animalModel = require("../models/animalModel");
const ownerModel = require("../models/ownerModel");
const date = require("date-and-time");
const sequelize = require("../configs/database");

const addAnimal = async (req, res) => {
  const {
    type,
    weight,
    pricePerKg,
    date,
    total,
    customerName,
    customerPhone,
    customerAddress,
  } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss");

    const newAnimal = await animalModel.create({
      type,
      weight,
      pricePerKg,
      total,
      date: date,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(201).json(newAnimal);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAnimalById = async (req, res) => {
  const { id } = req.params;
  try {
    const animal = await animalModel.findOne({
      where: {
        id: id,
      },
    });
    return res.status(200).json(animal);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAnimal,
  getAnimalById,
};
