const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const answer = require("../../models/index.js").answer;

module.exports = {
    giveCoupon: async (req, res) => {
        const { userName, userPhoneNumber } = req.body;
    },
    giveGmoney: async (req, res) => {},
    giveGpoint: async (req, res) => {},
    answer: async (req, res) => {
        const { title, content, askId } = req.body;

        const newAnswer = await answer.create({
            title: title,
            content: content,
            askId: askId,
        });
        res.status(200).send({ data: null, message: "등록 완료" });
    },
    askList: async (req, res) => {
        const { word, date, state } = req.body;

        let askListData = await ask.findAll({
            where: Sequelize.or({
                title: {
                    [Op.like]: `${word}%`,
                },
                content: {
                    [Op.like]: `${word}%`,
                },
            }),
            date: date,
        });
    },
};
