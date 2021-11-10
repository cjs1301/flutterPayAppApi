"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class storeQuestion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
            this.belongsTo(db.store, {
                foreignKey: "storeId",
                sourceKey: "id",
            });
            this.hasOne(db.storeAnswer);
        }
    }
    storeQuestion.init(
        {
            storeId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            state: {
                type: DataTypes.STRING,
                comment: "정산문의,결제문의,기타",
            },
            isShow: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            isAnswer: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            content: DataTypes.TEXT,
        },
        {
            sequelize,
            modelname: "storeQuestion",
        }
    );
    return storeQuestion;
};
