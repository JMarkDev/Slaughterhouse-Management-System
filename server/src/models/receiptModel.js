const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Receipt = sequelize.define(
  "receipts",
  {
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
    },
    animalData: {
      // Renamed from 'animals' to 'animalData'
      type: DataTypes.JSON,
      allowNull: true,
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

module.exports = Receipt;
