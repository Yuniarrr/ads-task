'use strict';

const bcrypt = require("bcryptjs");

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
    */

    const saltRounds = 10;
    const userHashedPassword = await bcrypt.hash("admin", saltRounds);

    return queryInterface.bulkInsert(
      "users",
      [
        {
          username: "users",
          email: "mail@gmail.com",
          password: userHashedPassword,
          no_telp: "081234567890",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
