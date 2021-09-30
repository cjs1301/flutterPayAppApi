"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    user.init(
        {
            userCode: DataTypes.INTEGER,
            userName: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            gMoney: DataTypes.INTEGER,
            alram: DataTypes.BOOLEAN,
            paymentPassword: DataTypes.STRING,
            activityArea: DataTypes.STRING,
            belongGroup: DataTypes.STRING,
        },
        {
            timestamps: false,
            sequelize,
            modelname: "user",
        }
    );
    return user;
};
