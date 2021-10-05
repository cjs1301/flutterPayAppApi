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
            this.belongsTo(db.ask, { foreignKey: "askId", sourceKey: "id" });
        }
    }
    answer.init(
        {
            askId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            content: DataTypes.TEXT,
        },
        {
            sequelize,
            modelname: "answer",
        }
    );
    return answer;
};
