const animalModel = require("../models/animalModel");
const date = require("date-and-time");
const sequelize = require("../config/database");
const ownerModel = require("../models/ownerModel");
const transactionModel = require("../models/transactionModel");
const { Sequelize, Op } = require("sequelize");

const addAnimal = async (req, res) => {
  const {
    customerName,
    customerPhone,
    customerAddress,
    type,
    condition,
    weight,
    pricePerKg,
    total,
    paidAmount,
    balance,
    status,
    slaughterDate,
    slaughterhouseId,
  } = req.body;

  try {
    // Format numeric fields to two decimal places
    const formattedPricePerKg = parseFloat(pricePerKg).toFixed(2);
    const formattedTotal = parseFloat(total).toFixed(2);
    const formattedPaidAmount = parseFloat(paidAmount).toFixed(2);
    const formattedBalance = parseFloat(balance).toFixed(2);

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss");

    const year = new Date().getFullYear().toString().slice(-2); // Last two digits of the year
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let transaction = "";

    // Generate an 8-character random string
    for (let i = 8; i > 0; --i) {
      transaction += chars[Math.floor(Math.random() * chars.length)];
    }

    // Add the last two digits of the year and a 2-digit timestamp for uniqueness
    const timestamp = Date.now().toString().slice(-2); // Last two digits of the milliseconds

    transaction = `${transaction}${timestamp}${year}`; // Total 12 characters

    const newTransaction = await transactionModel.create({
      id: transaction,
      transactionId: transaction,
      amountPaid: formattedPaidAmount,
      balance: formattedBalance,
      status: status,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    const newAnimal = await animalModel.create({
      id: transaction,
      type: type,
      condition: condition,
      weight: weight,
      pricePerKg: formattedPricePerKg,
      total: formattedTotal,
      slaughterDate: slaughterDate,
      slaughterhouseId: slaughterhouseId,
      transactionId: transaction,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    const newOwner = await ownerModel.create({
      id: newAnimal.id,
      customerName,
      customerPhone,
      customerAddress,
      animalId: newAnimal.id,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(201).json({
      newAnimal,
      newTransaction,
      newOwner,
      status: "success",
      message: "Added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const fetchAllAnimals = async (req, res) => {
  try {
    const animals = await animalModel.findAll(
      {
        include: [
          {
            model: ownerModel,
            required: true,
          },
          {
            model: transactionModel,
            required: true,
          },
        ],
      }
      // { raw: true }
    );
    return res.status(200).json(animals);
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
      include: [
        {
          model: ownerModel,
          required: true,
        },
        {
          model: transactionModel,
          required: true,
        },
      ],
    });

    return res.status(200).json(animal);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteAnimal = async (req, res) => {
  const { id } = req.params;
  try {
    const animal = await animalModel.destroy({
      where: {
        id: id,
      },
      include: [
        {
          model: ownerModel,
          required: true,
        },
        {
          model: transactionModel,
          required: true,
        },
      ],
    });
    return res
      .status(200)
      .json({ animal, status: "success", message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAnimalTypeBySlaughterhouse = async (req, res) => {
  const { type, slaughterhouseId } = req.params;
  try {
    let animals;
    if (type === "All") {
      animals = await animalModel.findAll({
        where: {
          slaughterhouseId: slaughterhouseId,
        },
        include: [
          {
            model: ownerModel,
            required: true,
          },
          {
            model: transactionModel,
            required: true,
          },
        ],
      });
      return res.status(200).json(animals);
    } else {
      animals = await animalModel.findAll({
        where: {
          type: type,
          slaughterhouseId: slaughterhouseId,
        },
        include: [
          {
            model: ownerModel,
            required: true,
          },
          {
            model: transactionModel,
            required: true,
          },
        ],
      });
    }

    return res.status(200).json(animals);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAnimalTypeByAdmin = async (req, res) => {
  const { type } = req.params;

  try {
    const animals = await animalModel.findAll({
      where: {
        type: type,
      },
      include: [
        {
          model: ownerModel,
          required: true,
        },
        {
          model: transactionModel,
          required: true,
        },
      ],
    });
    return res.status(200).json(animals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateAnimal = async (req, res) => {
  const { id } = req.params;
  const {
    customerName,
    customerPhone,
    customerAddress,
    type,
    condition,
    weight,
    pricePerKg,
    total,
    paidAmount,
    balance,
    status,
    slaughterDate,
  } = req.body;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss");

    const newTransaction = await transactionModel.update(
      {
        amountPaid: paidAmount,
        balance: balance,
        status: status,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: {
          id: id,
        },
      }
    );

    await animalModel.update(
      {
        type: type,
        condition: condition,
        weight: weight,
        pricePerKg: pricePerKg,
        total: total,
        slaughterDate: slaughterDate,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: {
          id: id,
        },
      }
    );

    await ownerModel.update(
      {
        customerName,
        customerPhone,
        customerAddress,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res
      .status(200)
      .json({ status: "success", message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const searchAnimals = async (req, res) => {
  const { name, slaughterhouseId } = req.params;
  try {
    const animals = await animalModel.findAll({
      where: {
        slaughterhouseId: slaughterhouseId,
      },
      include: [
        {
          model: ownerModel,
          required: true,
          where: {
            [Op.or]: [
              { customerName: { [Op.like]: `${name}%` } },
              { customerPhone: { [Op.like]: `${name}%` } },
              { customerAddress: { [Op.like]: `${name}%` } },
            ],
          },
        },
        {
          model: transactionModel,
          required: true,
          // where: {
          //   [Op.or]: [{ id: { [Op.like]: `${name}%` } }],
          // },
        },
      ],
    });
    return res.status(200).json(animals);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const searchTransaction = async (req, res) => {
  const { name, slaughterhouseId } = req.params;
  try {
    const animals = await animalModel.findAll({
      where: {
        slaughterhouseId: slaughterhouseId,
      },
      include: [
        {
          model: ownerModel,
          required: true,
        },
        {
          model: transactionModel,
          required: true,
          where: {
            [Op.or]: [{ id: { [Op.like]: `${name}%` } }],
          },
        },
      ],
    });
    return res.status(200).json(animals);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const searchCustomer = async (req, res) => {
  const { name } = req.params;

  try {
    const customer = await ownerModel.findAll({
      where: {
        [Op.or]: [
          {
            customerName: {
              [Op.like]: `${name}%`,
            },
          },
        ],
      },
    });
    return res.status(200).json(customer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAnimalsBySlaughterhouse = async (req, res) => {
  const { slaughterhouseId } = req.params;
  try {
    const animals = await animalModel.findAll({
      where: {
        slaughterhouseId: slaughterhouseId,
      },
    });
    return res.status(200).json(animals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filterByStatus = async (req, res) => {
  const { status, slaughterhouseId } = req.params;
  try {
    const animals = await animalModel.findAll({
      where: {
        slaughterhouseId: slaughterhouseId,
      },
      include: [
        {
          model: ownerModel,
          required: true,
        },
        {
          model: transactionModel,
          required: true,
          where: {
            status: status,
          },
        },
      ],
    });
    return res.status(200).json(animals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTransactionBySlaughterhouse = async (req, res) => {
  const { slaughterhouseId } = req.params;
  try {
    const animals = await animalModel.findAll({
      where: {
        slaughterhouseId: slaughterhouseId,
      },
      include: [
        {
          model: ownerModel,
          required: true,
        },
        {
          model: transactionModel,
          required: true,
        },
      ],
    });
    return res.status(200).json(animals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filterByDateRange = async (req, res) => {
  const { startDate, endDate, slaughterhouseId } = req.params;
  try {
    const animals = await animalModel.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        slaughterhouseId: slaughterhouseId,
      },
      include: [
        {
          model: ownerModel,
          required: true,
        },
        {
          model: transactionModel,
          required: true,
        },
      ],
    });
    return res.status(200).json(animals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filterAllAnimals = async (req, res) => {
  const {
    type,
    startDate,
    endDate,
    slaughterhouseId,
    name,
    status,
    transactionID,
    customerName,
  } = req.query;

  const whereConditions = {};

  if (type && type !== "All") {
    whereConditions.type = type;
  }

  if (startDate && endDate) {
    whereConditions.createdAt = {
      [Sequelize.Op.between]: [startDate, endDate],
    };
  }

  const ownerWhereCondition = name
    ? {
        [Op.or]: [
          { customerName: { [Op.like]: `${name}%` } },
          { customerPhone: { [Op.like]: `${name}%` } },
          { customerAddress: { [Op.like]: `${name}%` } },
        ],
      }
    : {};

  if (slaughterhouseId && slaughterhouseId !== "All") {
    whereConditions.slaughterhouseId = slaughterhouseId;
  }

  const transactionWhereCondition = {};

  if (status && status !== "Default") {
    transactionWhereCondition.status = status;
  }

  if (transactionID) {
    transactionWhereCondition.id = {
      [Op.like]: `${transactionID}%`,
    };
  }

  if (customerName) {
    ownerWhereCondition.customerName = {
      [Op.like]: `${customerName}%`,
    };
  }

  try {
    const animals = await animalModel.findAll({
      where: whereConditions,
      include: [
        {
          model: ownerModel,
          required: true,
          where: ownerWhereCondition,
        },
        {
          model: transactionModel,
          required: true,
          where: transactionWhereCondition,
        },
      ],
    });
    return res.status(200).json(animals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAnimal,
  getAnimalById,
  deleteAnimal,
  getAnimalTypeBySlaughterhouse,
  getAnimalTypeByAdmin,
  updateAnimal,
  searchAnimals,
  searchCustomer,
  searchTransaction,
  getAnimalsBySlaughterhouse,
  fetchAllAnimals,
  filterByStatus,
  getTransactionBySlaughterhouse,
  filterByDateRange,
  filterAllAnimals,
};
