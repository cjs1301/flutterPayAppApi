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
            email: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            gMoney: DataTypes.INTEGER,
            gPoint: DataTypes.INTEGER,
            notiAlram: DataTypes.BOOLEAN,
            fcmToken: DataTypes.STRING,
            belongGroup: DataTypes.STRING,
            rute: DataTypes.STRING,
            couponCount: DataTypes.INTEGER,
        },
        {
            timestamps: false,
            sequelize,
            modelname: "user",
        }
    );
    return user;
};
