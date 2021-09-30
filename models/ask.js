"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ask extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    ask.init(
        {
            title: DataTypes.STRING,
            content: DataTypes.TEXT,
        },
        {
            sequelize,
            modelname: "ask",
        }
    );
    return ask;
};
