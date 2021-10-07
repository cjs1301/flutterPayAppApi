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
        const { title, content, questionId } = req.body;

        const newAnswer = await answer.create({
            title: title,
            content: content,
            questionId: questionId,
        });
        res.status(200).send({ data: null, message: "등록 완료" });
    },
    questionList: async (req, res) => {
        const { word, date, state } = req.body;

        let questionListData = await question.findAll({
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
