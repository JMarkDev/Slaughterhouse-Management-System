const animalModel = require("../models/animalModel");
const date = require("date-and-time");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const ownerModel = require("../models/ownerModel");
const transactionModel = require("../models/transactionModel");
const transactionStatus = require("../constants/transactionStatus");
const userModel = require("../models/userModel");
const statusList = require("../constants/statusList");
const notificationModel = require("../models/notificationModel");

const updateTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    // Format the current date
    const formattedDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Find the transaction by ID
    const getTransaction = await transactionModel.findOne({
      where: {
        id: id,
      },
    });

    const getOwner = await ownerModel.findOne({
      where: {
        id: id,
      },
    });

    const { customerName } = getOwner;

    if (!getTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Calculate updated fields
    const amountPaid =
      parseFloat(getTransaction.balance) +
      parseFloat(getTransaction.amountPaid);
    const updatedData = {
      amountPaid: amountPaid.toFixed(2), // Ensure proper formatting
      updatedAt: formattedDate,
      status: transactionStatus.paid,
      balance: 0.0, // Balance is set to 0 after payment
    };

    // Update the transaction
    await transactionModel.update(updatedData, {
      where: {
        id: id,
      },
    });

    const users = await userModel.findAll({
      where: {
        status: statusList.verified,
      },
    });

    await Promise.all(
      users.map(async (user) => {
        await notificationModel.create({
          transactionId: getTransaction.id,
          user_id: user.id,
          ownerName: customerName,
          message: `Transaction ID: ${getTransaction.id} has been paid by ${customerName}.`,
          is_read: 0,
          createdAt: sequelize.literal(`'${formattedDate}'`),
        });
      })
    );

    return res.status(200).json({
      status: "success",
      message: "Transaction updated successfully",
      updatedData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateTransaction,
};
