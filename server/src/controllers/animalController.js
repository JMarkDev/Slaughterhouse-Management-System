const animalModel = require("../models/animalModel");
const date = require("date-and-time");
const sequelize = require("../config/database");
const ownerModel = require("../models/ownerModel");
const transactionModel = require("../models/transactionModel");
const { Sequelize, Op } = require("sequelize");
const notificationModel = require("../models/notificationModel");
const userModel = require("../models/userModel");
const receiptModel = require("../models/receiptModel");
const rolesList = require("../constants/rolesList");
const statusList = require("../constants/statusList");

// const addAnimal = async (req, res) => {
//   const {
//     customerName,
//     customerPhone,
//     customerAddress,
//     type,
//     condition,
//     weight,
//     pricePerKg,
//     total,
//     paidAmount,
//     balance,
//     status,
//     slaughterDate,
//     slaughterhouseId,
//   } = req.body;

//   try {
//       // Validate the incoming animals array
//       if (!Array.isArray(animals) || animals.length === 0) {
//         return res.status(400).json({ message: "Animals data is required." });
//       }

//       const createdAt = new Date();
//       const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time

//     // Format numeric fields to two decimal places
//     const formattedPricePerKg = parseFloat(pricePerKg).toFixed(2);
//     const formattedTotal = parseFloat(total).toFixed(2);
//     const formattedPaidAmount = parseFloat(paidAmount).toFixed(2);
//     const formattedBalance = parseFloat(balance).toFixed(2);

//     const year = new Date().getFullYear().toString().slice(-2); // Last two digits of the year
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let transaction = "";

//     // Generate an 8-character random string
//     for (let i = 8; i > 0; --i) {
//       transaction += chars[Math.floor(Math.random() * chars.length)];
//     }

//     // Add the last two digits of the year and a 2-digit timestamp for uniqueness
//     const timestamp = Date.now().toString().slice(-2); // Last two digits of the milliseconds

//     transaction = `${transaction}${timestamp}${year}`; // Total 12 characters

//     const newTransaction = await transactionModel.create({
//       id: transaction,
//       transactionId: transaction,
//       amountPaid: formattedPaidAmount,
//       balance: formattedBalance,
//       status: status,
//       createdAt: sequelize.literal(`'${formattedDate}'`),
//     });

//     const newAnimal = await animalModel.create({
//       id: transaction,
//       type: type,
//       condition: condition,
//       weight: weight,
//       pricePerKg: formattedPricePerKg,
//       total: formattedTotal,
//       slaughterDate: slaughterDate,
//       slaughterhouseId: slaughterhouseId,
//       transactionId: transaction,
//       createdAt: sequelize.literal(`'${formattedDate}'`),
//     });

//     const newOwner = await ownerModel.create({
//       id: newAnimal.id,
//       customerName,
//       customerPhone,
//       customerAddress,
//       animalId: newAnimal.id,
//       createdAt: sequelize.literal(`'${formattedDate}'`),
//     });

//     const admin = await userModel.findAll({
//       where: {
//         role: rolesList.admin,
//         status: statusList.verified,
//       },
//     });

//     await Promise.all(
//       admin.map(async (user) => {
//         await notificationModel.create({
//           transactionId: newTransaction.id,
//           user_id: user.id,
//           ownerName: customerName,
//           message: `New transaction added with transaction ID: ${newTransaction.id}`,
//           is_read: 0,
//           createdAt: sequelize.literal(`'${formattedDate}'`),
//         });
//       })
//     );

//     return res.status(201).json({
//       newAnimal,
//       newTransaction,
//       newOwner,
//       status: "success",
//       message: "Added successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error.message });
//   }
// };

// const addAnimal = async (req, res) => {
//   const {
//     customerName,
//     customerPhone,
//     customerAddress,
//     slaughterhouseId,
//     animals, // Expecting this as an array from the frontend
//   } = req.body;

//   try {
//     // Validate the incoming animals array
//     if (!Array.isArray(animals) || animals.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Animals data is required and must be an array." });
//     }

//     const createdAt = new Date();
//     const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // UTC format

//     const transactionPromises = animals.map(async (animal) => {
//       // Generate a unique transaction ID for each animal
//       const year = new Date().getFullYear().toString().slice(-2); // Last two digits of the year
//       const chars =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//       const timestamp = Date.now().toString().slice(-2); // Last two digits of milliseconds
//       let transaction = Array(8)
//         .fill(null)
//         .map(() => chars[Math.floor(Math.random() * chars.length)])
//         .join("");
//       transaction = `${transaction}${timestamp}${year}`; // 12-character unique ID

//       // Format numeric fields
//       const {
//         type,
//         condition,
//         slaughterDate,
//         weight,
//         pricePerKg,
//         total,
//         paidAmount,
//         balance,
//         status,
//       } = animal;

//       const formattedPricePerKg = parseFloat(pricePerKg).toFixed(2);
//       const formattedTotal = parseFloat(total).toFixed(2);
//       const formattedPaidAmount = parseFloat(paidAmount || 0).toFixed(2);
//       const formattedBalance = parseFloat(balance || 0).toFixed(2);

//       // Create the transaction entry in the database
//       const newTransaction = await transactionModel.create({
//         id: transaction,
//         transactionId: transaction,
//         amountPaid: formattedPaidAmount,
//         balance: formattedBalance,
//         status: status || 1, // Default status
//         createdAt: sequelize.literal(`'${formattedDate}'`),
//       });

//       // Create the animal entry and associate it with the transaction
//       const newAnimal = await animalModel.create({
//         id: `${transaction}_${Math.random().toString(36).substring(7)}`, // Unique ID
//         type,
//         condition,
//         weight,
//         pricePerKg: formattedPricePerKg,
//         total: formattedTotal,
//         slaughterDate,
//         slaughterhouseId,
//         transactionId: transaction, // Associate with transaction ID
//         createdAt: sequelize.literal(`'${formattedDate}'`),
//       });

//       // Create the owner entry and link it to the transaction
//       const newOwner = await ownerModel.create({
//         id: transaction, // Use transaction ID for owner ID
//         customerName,
//         customerPhone,
//         customerAddress,
//         animalId: newAnimal.id, // Link to the current animal
//         createdAt: sequelize.literal(`'${formattedDate}'`),
//       });

//       // Notify all admins
//       const adminUsers = await userModel.findAll({
//         where: {
//           role: rolesList.admin,
//           status: statusList.verified,
//         },
//       });

//       const notificationPromises = adminUsers.map(async (admin) => {
//         await notificationModel.create({
//           transactionId: transaction,
//           user_id: admin.id,
//           ownerName: customerName,
//           message: `New transaction added with transaction ID: ${transaction}`,
//           is_read: 0,
//           createdAt: sequelize.literal(`'${formattedDate}'`),
//         });
//       });

//       await Promise.all(notificationPromises);

//       return { newTransaction, newAnimal, newOwner };
//     });

//     const results = await Promise.all(transactionPromises);

//     return res.status(201).json({
//       transactions: results,
//       status: "success",
//       message: "Transactions and animals added successfully.",
//     });
//   } catch (error) {
//     console.error("Error in addAnimal:", error.message);
//     return res.status(500).json({ message: error.message });
//   }
// };

const addAnimal = async (req, res) => {
  const {
    customerName,
    customerPhone,
    customerAddress,
    slaughterhouseId,
    animals, // Expecting this as an array from the frontend
  } = req.body;

  try {
    // Validate the incoming animals array
    if (!Array.isArray(animals) || animals.length === 0) {
      return res
        .status(400)
        .json({ message: "Animals data is required and must be an array." });
    }

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // UTC format

    // Create a receipt
    const receiptId = `${slaughterhouseId}_${Math.random()
      .toString(36)
      .substring(7)}`;
    const newReceipt = await receiptModel.create({
      id: receiptId,
      animalData: animals,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    const transactionPromises = animals.map(async (animal) => {
      // Generate a unique transaction ID for each animal
      const year = new Date().getFullYear().toString().slice(-2); // Last two digits of the year
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const timestamp = Date.now().toString().slice(-2); // Last two digits of milliseconds
      let transaction = Array(8)
        .fill(null)
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
      transaction = `${transaction}${timestamp}${year}`; // 12-character unique ID

      // Format numeric fields
      const {
        type,
        condition,
        slaughterDate,
        weight,
        no_of_heads,
        pricePerKg,
        total,
        paidAmount,
        balance,
        status,
        category,
      } = animal;

      const formattedPricePerKg = parseFloat(pricePerKg).toFixed(2);
      const formattedTotal = parseFloat(total).toFixed(2);
      const formattedPaidAmount = parseFloat(paidAmount || 0).toFixed(2);
      const formattedBalance = parseFloat(balance || 0).toFixed(2);

      // Create the transaction entry in the database
      const newTransaction = await transactionModel.create({
        id: transaction,
        transactionId: transaction,
        amountPaid: formattedPaidAmount,
        balance: formattedBalance,
        status: status || 1, // Default status
        createdAt: sequelize.literal(`'${formattedDate}'`),
      });

      // Create the animal entry and associate it with the receipt and transaction
      const newAnimal = await animalModel.create({
        id: transaction,
        type,
        condition,
        noOfHeads: no_of_heads,
        weight,
        pricePerKg: formattedPricePerKg,
        total: formattedTotal,
        slaughterDate,
        slaughterhouseId,
        transactionId: transaction, // Associate with transaction ID
        receiptId, // Associate with receipt ID
        category,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      });

      // Create the owner entry and link it to the transaction
      const newOwner = await ownerModel.create({
        id: transaction, // Use transaction ID for owner ID
        customerName,
        customerPhone,
        customerAddress,
        animalId: newAnimal.id, // Link to the current animal
        createdAt: sequelize.literal(`'${formattedDate}'`),
      });

      // Notify all admins
      const adminUsers = await userModel.findAll({
        where: {
          role: rolesList.admin,
          status: statusList.verified,
        },
      });

      const notificationPromises = adminUsers.map(async (admin) => {
        await notificationModel.create({
          transactionId: transaction,
          user_id: admin.id,
          ownerName: customerName,
          message: `New transaction added with transaction ID: ${transaction}`,
          is_read: 0,
          createdAt: sequelize.literal(`'${formattedDate}'`),
        });
      });

      await Promise.all(notificationPromises);

      return { newTransaction, newAnimal, newOwner };
    });

    const results = await Promise.all(transactionPromises);

    return res.status(201).json({
      transactions: results,
      receipt: newReceipt,
      status: "success",
      message: "Transactions, animals, and receipt added successfully.",
    });
  } catch (error) {
    console.error("Error in addAnimal:", error.message);
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
          {
            model: receiptModel,
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
        {
          model: receiptModel,
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

  // Normalize startDate and endDate to include the entire range
  if (startDate && endDate) {
    whereConditions.createdAt = {
      [Sequelize.Op.between]: [
        new Date(`${startDate}T00:00:00.000Z`), // Start of the day
        new Date(`${endDate}T23:59:59.999Z`), // End of the day
      ],
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
