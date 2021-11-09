"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class subscription extends Model {
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
    subscription.init(
        {
            userId: DataTypes.INTEGER,
            userName: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            email: DataTypes.STRING,
            cancelDate: {
                type: DataTypes.DATE,
                comment: "약정충전취소 시 생성되는 날짜",
            },
            terminationCompleteDate: {
                type: DataTypes.DATE,
                comment: "약정충전취소완료 시 생성되는 날짜",
            },
            state: {
                type: DataTypes.STRING,
                comment: "신청대기,약정충전진행,해지신청,해지완료",
            },
            file: DataTypes.STRING,
        },
        {
            sequelize,
            modelname: "subscription",
        }
    );
    return subscription;
};
