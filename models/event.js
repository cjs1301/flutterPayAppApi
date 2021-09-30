"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class event extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    event.init(
        {
            img: DataTypes.STRING,
            bannerImg: DataTypes.STRING,
            content: DataTypes.TEXT,
            title: DataTypes.STRING,
        },
        {
            sequelize,
            modelname: "event",
        }
    );
    return event;
};
