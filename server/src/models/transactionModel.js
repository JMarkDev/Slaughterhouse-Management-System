const sequelize = require("../configs/database");
const { DataTypes } = require("sequelize");
const animalModel = require("./animalModel");
const ownerModel = require("./ownerModel");
const userModel = require("./userModel");

const Transaction = sequelize.define(
  "transactions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amountDue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    animalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: animalModel,
        key: "id",
      },
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ownerModel,
        key: "id",
      },
    },
    slaughterhouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Transaction;
