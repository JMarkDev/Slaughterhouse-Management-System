"use strict";

const { createdAt } = require("../utils/formattedTime");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("notifications", [
      {
        user_id: 1, // Ensure this corresponds to a valid user ID in your users table
        content: "Document forwarded to: OIC Dean of ESU Office",
        is_read: 0,
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        user_id: 1,
        content: "Document forwarded to: Vice President Office",
        is_read: 0,
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        user_id: 1,
        content: "Document forwarded to: Human Resource Office",
        is_read: 0,
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        user_id: 1,
        content: "Document forwarded to: Accounting Office",
        is_read: 0,
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        user_id: 1,
        content: "Document forwarded to: Records Office",
        is_read: 0,
        createdAt: createdAt,
        updatedAt: createdAt,
      },
      {
        user_id: 1,
        content: "Document Received by: Records Office",
        is_read: 0,
        createdAt: createdAt,
        updatedAt: createdAt,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("notifications", null, {});
  },
};
