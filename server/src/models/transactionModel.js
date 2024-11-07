const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
// const animalModel = require("./animalModel");
// const ownerModel = require("./ownerModel");
// const userModel = require("./userModel");

const Transaction = sequelize.define(
  "transactions",
  {
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      // autoIncrement: true,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Paid", "Partial", "Unpaid"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Transaction;
