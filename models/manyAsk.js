"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class manyAsk extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    manyAsk.init(
        {
            title: DataTypes.STRING,
            content: DataTypes.TEXT,
        },
        {
            timestamps: false,
            sequelize,
            modelname: "manyAsk",
        }
    );
    return manyAsk;
};
