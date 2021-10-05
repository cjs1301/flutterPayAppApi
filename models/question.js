"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class question extends Model {
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
    question.init(
        {
            userId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            content: DataTypes.TEXT,
        },
        {
            sequelize,
            modelname: "question",
        }
    );
    return question;
};
