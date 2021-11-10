"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class storeAnswer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
            this.belongsTo(db.storeQuestion, {
                foreignKey: "storeQuestionId",
                sourceKey: "id",
            });
        }
    }
    storeAnswer.init(
        {
            storeQuestionId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            content: DataTypes.TEXT,
            isShow: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelname: "storeAnswer",
        }
    );
    return storeAnswer;
};
