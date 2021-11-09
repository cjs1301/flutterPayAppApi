"use strict";
const { Model } = require("sequelize");
const emojiRegex = require("emoji-regex");
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
            this.hasOne(db.answer);
        }
    }
    question.init(
        {
            userId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            state: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            content: DataTypes.TEXT,
        },
        {
            hooks: {
                afterValidate: (question, options) => {
                    question.title = question.title.replace(emojiRegex(), "");

                    question.content = question.content.replace(
                        emojiRegex(),
                        ""
                    );
                },
            },
            sequelize,
            modelname: "question",
        }
    );
    return question;
};
