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
            this.hasMany(db.transaction);
        }
    }
    user.init(
        {
            idValue: DataTypes.STRING,
            userName: DataTypes.STRING,
            email: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            gMoney: DataTypes.INTEGER,
            gPoint: DataTypes.INTEGER,
            notiAlarm: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
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
