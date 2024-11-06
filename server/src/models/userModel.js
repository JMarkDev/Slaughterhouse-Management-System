const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const Animal = require("./animalModel");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    middleInitial: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(55),
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(455),
      allowNull: false,
    },
    role: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT(1),
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
    // slaughterhouseId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  },
  {
    timestamps: false,
  }
);

User.hasMany(Animal, { foreignKey: "slaughterhouseId" });
Animal.belongsTo(User, { foreignKey: "slaughterhouseId" });

module.exports = User;
