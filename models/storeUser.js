"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class storeUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    storeUser.init(
        {
            storeUserId: DataTypes.STRING,
            passwored: DataTypes.STRING,
        },
        {
            timestamps: false,
            sequelize,
            modelname: "storeUser",
        }
    );
    return storeUser;
};
