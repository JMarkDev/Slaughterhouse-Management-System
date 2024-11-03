"use strict";
const { createdAt } = require("../utils/formattedTime");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("routes", [
      {
        id: 1,
        document_type: "IOR (Internal Office Reports)", // Example document type
        route: JSON.stringify([
          { user_id: null, office_name: "Faculty" },
          { user_id: null, office_name: "Registrar" },
          { user_id: 1, office_name: "OIC Dean of External Studies Unit" },
          {
            user_id: 2,
            office_name: "Vice President for Academic Affairs Office",
          },
          { user_id: 3, office_name: "Human Resources Office" },
          { user_id: 4, office_name: "Accounting Office" },
          { user_id: 5, office_name: "Records Office" },
        ]),
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        id: 2,
        document_type: "IDP (Individual Development Plans)", // Another example document type
        route: JSON.stringify([
          { user_id: null, office_name: "Faculty" },
          { user_id: null, office_name: "Registrar" },
          { user_id: 1, office_name: "OIC Dean of External Studies Unit" },
          {
            user_id: 2,
            office_name: "Vice President for Academic Affairs Office",
          },
          { user_id: 3, office_name: "Human Resources Office" },
          { user_id: 4, office_name: "Accounting Office" },
          { user_id: 5, office_name: "Records Office" },
        ]),
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        id: 3,
        document_type: "DTR (Daily Time Record)", // Another example document type
        route: JSON.stringify([
          { user_id: null, office_name: "Faculty" },
          { user_id: null, office_name: "Registrar" },
          { user_id: 1, office_name: "OIC Dean of External Studies Unit" },
          {
            user_id: 2,
            office_name: "Vice President for Academic Affairs Office",
          },
          { user_id: 3, office_name: "Human Resources Office" },
          { user_id: 4, office_name: "Accounting Office" },
          { user_id: 5, office_name: "Records Office" },
        ]),
        createdAt: createdAt,
        updatedAt: createdAt,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("routes", null, {});
  },
};
