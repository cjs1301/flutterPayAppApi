"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class storeNotice extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    storeNotice.init(
        {
            title: DataTypes.STRING,
            content: DataTypes.TEXT,
            writer: DataTypes.STRING,
            isShow: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            hide: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelname: "storeNotice",
        }
    );
    return storeNotice;
};
