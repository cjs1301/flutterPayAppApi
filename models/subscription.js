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
    } //관리앱 충전신청일자, 이름, 신청금액, 은행-계좌번호, 전화번호, 이메일, 충전상태
    subscription.init(
        {
            userId: DataTypes.INTEGER,
            userName: DataTypes.STRING,
            money: DataTypes.INTEGER,
            bankName: DataTypes.STRING,
            bankNumber: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            birthday: DataTypes.STRING,
            email: DataTypes.STRING,
            withdrawalDate: DataTypes.INTEGER,
            state: DataTypes.STRING,
            TerminationDate: DataTypes.STRING,
        },
        {
            sequelize,
            modelname: "subscription",
        }
    );
    return subscription;
};
