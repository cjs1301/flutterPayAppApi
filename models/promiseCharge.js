"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class contractCharge extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
            this.belongsTo(db.user, { foreignKey: "userId", sourceKey: "id" });
        }
    }
    contractCharge.init(
        {
            userId: DataTypes.INTEGER,
            userName: DataTypes.STRING,
            birthday: DataTypes.STRING,
            bankName: DataTypes.STRING,
            bankNumber: DataTypes.STRING,
        },
        {
            sequelize,
            modelname: "contractCharge",
        }
    );
    return contractCharge;
};
