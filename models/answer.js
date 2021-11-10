"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class answer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
            this.belongsTo(db.question, {
                foreignKey: "questionId",
                sourceKey: "id",
            });
        }
    }
    answer.init(
        {
            questionId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            content: DataTypes.TEXT,
            isShow: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelname: "answer",
        }
    );
    return answer;
};
