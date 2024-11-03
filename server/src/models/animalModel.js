const sequelize = require("../configs/database");
const { DataTypes } = require("sequelize");
const ownerModel = require("./ownerModel");

const Animal = sequelize.define("animals", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pricePerKg: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // ownerId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: ownerModel,
  //     key: "id",
  //   },
  // },
  timestamps: false,
});

module.exports = Animal;
