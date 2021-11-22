"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class faq extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    faq.init(
        {
            title: {
                type: DataTypes.STRING,
                comment: "제목",
            },
            content: DataTypes.TEXT,
            writer: DataTypes.STRING,
            isExpanded: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isShow: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelname: "faq",
            comment: "자주 묻는 질문",
        }
    );
    return faq;
};
