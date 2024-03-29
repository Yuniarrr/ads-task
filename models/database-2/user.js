'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    no_telp: DataTypes.STRING,
    otp_enabled: DataTypes.BOOLEAN,
    otp_auth_url: DataTypes.STRING,
    secret: DataTypes.STRING,
    name: DataTypes.STRING,
    photo_profile: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};