"use strict";
const { Model } = require("sequelize");
const emojiRegex = require("emoji-regex");
module.exports = (sequelize, DataTypes) => {
    class event extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    event.init(
        {
            img: DataTypes.STRING,
            bannerImg: DataTypes.STRING,
            writer: DataTypes.STRING,
            content: DataTypes.TEXT,
            title: DataTypes.STRING,
            isShow: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            hide: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            state: {
                type: DataTypes.STRING,
                comment: "시작전,진행중,종료",
            },
            startDate: DataTypes.DATE,
            endDate: DataTypes.DATE,
        },
        {
            hooks: {
                afterValidate: (event, options) => {
                    event.title = event.title.replace(emojiRegex(), "");

                    event.content = event.content.replace(emojiRegex(), "");
                },
                // afterSave: (event, options) => {
                //     let today = new Date();
                //     console.log(event.startDate < today);
                //     console.log(event.startDate);
                //     console.log(today);
                //     if (event.startDate < today) {
                //         event.state = "시작전";
                //     }
                //     if (event.startDate <= today && today <= event.endDate) {
                //         event.state = "진행중";
                //     }
                //     if (event.endDate < today) {
                //         event.state = "종료";
                //     }
                //     event.state = "시작전";
                //     console.log(event);
                // },
            },
            sequelize,
            modelname: "event",
        }
    );
    return event;
};
