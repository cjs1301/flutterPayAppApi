"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class store extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    store.init(
        {
            name: DataTypes.STRING,
            introduction: DataTypes.TEXT,
            location: DataTypes.STRING,
            ownerName: DataTypes.STRING,
            callNumber: DataTypes.STRING,
            openingHours: DataTypes.STRING,
            logoImg: DataTypes.STRING,
        },
        {
            timestamps: false,
            sequelize,
            modelname: "store",
        }
    );
    return store;
};
