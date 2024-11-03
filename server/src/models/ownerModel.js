const sequelize = require("../configs/database");
const { DataTypes } = require("sequelize");
const Animal = require("./animalModel");

const Owner = sequelize.define("owners", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  animalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Animal,
      key: "id",
    },
  },
});

Owner.hasMany(Animal, { foreignKey: "ownerId", onDelete: "CASCADE" });
Animal.belongsTo(Owner, { foreignKey: "ownerId", onDelete: "CASCADE" });

module.exports = Owner;
