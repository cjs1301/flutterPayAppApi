const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const notice = require("../../models/index.js").notice;

module.exports = {
    uploadAndEdit: async (req, res) => {
        const { title, content } = req.body;

        const newNotice = await notice.create({
            title: title,
            content: content,
        });
        res.status(200).send({ data: null, message: "등록 완료" });
    },
    delete: async (req, res) => {
        const { noticeId } = req.body;
        const deletNotice = await notice.findOne({ where: { id: noticeId } });
        deletNotice.distory();
        res.status(200).send({
            data: null,
            message: "성공적으로 삭제 하였습니다.",
        });
    },
    answer: async (req, res) => {
        const { title, content, questionId } = req.body;

        const newAnswer = await answer.create({
            title: title,
            content: content,
            questionId: questionId,
        });
        const saveAnswer = await question.findOne({
            where: { id: questionId },
        });
        saveAnswer.state = true;
        saveAnswer.save();
        const findUser = await user.findOne({
            where: { id: saveAnswer.userId },
        });
        let notiMessage = {
            title: "문의글에 대한 답변",
            body: `${saveAnswer.title}에 대한 답변이 등록 되었습니다.`,
        };
        await alarm.create({
            userId: findUser.id,
            title: notiMessage.title,
            content: notiMessage.body,
        });
        pushEvent.noti(notiMessage, findUser.fcmToken);
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
