"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class type extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    type.init(
        {
            type: DataTypes.STRING,
        },
        {
            timestamps: false,
            sequelize,
            modelname: "type",
        }
    );
    return type;
};
