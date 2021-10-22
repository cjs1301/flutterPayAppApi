"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
            this.belongsTo(db.user, { foreignKey: "userId", sourceKey: "id" });
            this.belongsTo(db.store, {
                foreignKey: "storeId",
                sourceKey: "id",
            });
        }
    }
    transaction.init(
        {
            userId: DataTypes.INTEGER,
            storeId: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            gMoney: DataTypes.INTEGER,
            useGpoint: DataTypes.INTEGER,
            couponData: DataTypes.STRING,
            state: DataTypes.STRING,
        },
        {
            sequelize,
            modelname: "transaction",
        }
    );
    return transaction;
};
