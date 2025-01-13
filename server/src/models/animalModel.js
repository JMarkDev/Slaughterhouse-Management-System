const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const Transaction = require("./transactionModel");
const Owner = require("./ownerModel");
const Receipt = require("./receiptModel");

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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    noOfHeads: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pricePerKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
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
    receiptId: {
      type: DataTypes.STRING(55),
      allowNull: true,
      references: {
        model: "receipts",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

Animal.belongsTo(Transaction, {
  foreignKey: "transactionId",
  onDelete: "CASCADE",
});
Transaction.hasMany(Animal, {
  foreignKey: "transactionId",
  onDelete: "CASCADE",
});

Animal.hasOne(Owner, { foreignKey: "animalId", onDelete: "CASCADE" });
Owner.belongsTo(Animal, { foreignKey: "animalId", onDelete: "CASCADE" });

// Animal Model
Animal.belongsTo(Receipt, {
  foreignKey: "receiptId",
  onDelete: "CASCADE",
});
Receipt.hasMany(Animal, {
  foreignKey: "receiptId",
  onDelete: "CASCADE",
});

module.exports = Animal;
