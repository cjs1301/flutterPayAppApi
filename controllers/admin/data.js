const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const alarm = require("../../models/index.js").alarm;
const answer = require("../../models/index.js").answer;
const question = require("../../models/index.js").question;
const notice = require("../../models/index.js").notice;
const storeNotice = require("../../models/index.js").storeNotice;
const pushEvent = require("../push");

module.exports = {
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
};
