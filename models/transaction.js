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
            actionUserName: {
                type: DataTypes.STRING,
                comment: "송금,입금에 대한 대상자",
            },
            storeId: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            gMoney: DataTypes.INTEGER,
            useGpoint: DataTypes.INTEGER,
            couponData: DataTypes.STRING,
            state: {
                type: DataTypes.STRING,
                comment:
                    "결제완료,결제실패,결제취소,송금,입금,일반충전,약정충전",
            },
            cancelDate: {
                type: DataTypes.DATE,
                comment: "결제취소 시 생성되는 날짜",
            },
            minus: DataTypes.BOOLEAN,
            checkBalance: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelname: "transaction",
        }
    );
    return transaction;
};
