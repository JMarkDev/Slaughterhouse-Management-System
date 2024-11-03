"use strict";
const { createdAt } = require("../utils/formattedTime");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     * 
     *   {
 
     */
    return queryInterface.bulkInsert("offices", [
      {
        id: 1,
        officeName: "OIC DEAN OF EXTERNAL STUDIES UNIT OFFICE",
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        id: 2,
        officeName: "VICE PRESIDENT FOR ACADEMIC AFFAIRS OFFICE",
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        id: 3,
        officeName: "HUMAN RESOURCE OFFICE",
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        id: 4,
        officeName: "ACCOUNTING OFFICE",
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        id: 5,
        officeName: "RECORDS OFFICE",
        createdAt: createdAt,
        updatedAt: createdAt,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("offices", null, {});
  },
};
