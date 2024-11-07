const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Owner = sequelize.define("owners", {
  id: {
    type: DataTypes.STRING(55),
    primaryKey: true,
    // autoIncrement: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerAddress: {
    type: DataTypes.STRING,
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
    type: DataTypes.STRING(55),
    allowNull: false,
    references: {
      model: "animals",
      key: "id",
    },
  },
});

module.exports = Owner;
