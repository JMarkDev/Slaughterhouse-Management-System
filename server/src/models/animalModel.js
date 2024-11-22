const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const Transaction = require("./transactionModel");
const Owner = require("./ownerModel");

const Animal = sequelize.define(
  "animals",
  {
    id: {
      type: DataTypes.STRING(55),
      primaryKey: true,
      // autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    condition: {
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
    slaughterDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    slaughterhouseId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    transactionId: {
      type: DataTypes.STRING(55),
      allowNull: false,
      references: {
        model: "transactions",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

Animal.hasOne(Transaction, { foreignKey: "id", onDelete: "CASCADE" });
Transaction.belongsTo(Animal, { foreignKey: "id", onDelete: "CASCADE" });

Animal.hasOne(Owner, { foreignKey: "animalId", onDelete: "CASCADE" });
Owner.belongsTo(Animal, { foreignKey: "animalId", onDelete: "CASCADE" });

module.exports = Animal;
