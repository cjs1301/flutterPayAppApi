const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const question = require("../../models/index.js").question;
const answer = require("../../models/index.js").answer;
const alarm = require("../../models/index.js").alarm;
const token = require("../../modules/token");
const { Op } = require("sequelize");
const pushEvent = require("../../modules/push");

module.exports = {
    delete: async (req, res) => {
        const authorization = req.headers.authorization;
        let admin = await token.storeCheck(authorization);
        if (!admin) {
            return res.status(403).send({
                data: null,
                message: "유효하지 않은 토큰 입니다.",
            });
        }
        const { id } = req.body;
        const deletQuestion = await question.findOne({
            where: { id: id },
        });
        if (!deletQuestion) {
            return res.status(400).send({
                data: null,
                message: "해당 게시글은 없습니다.",
            });
        }
        deletQuestion.isShow = false;
        await deletQuestion.save();
        return res.status(200).send({
            data: null,
            message: "성공적으로 삭제 하였습니다.",
        });
    },
    answer: async (req, res) => {
        const { title, content, questionId, writer } = req.body;
        const authorization = req.headers.authorization;
        let admin = await token.storeCheck(authorization);
        if (!admin) {
            return res.status(403).send({
                data: null,
                message: "유효하지 않은 토큰 입니다.",
            });
        }
        try {
            const saveAnswer = await question.findOne({
                where: { id: questionId },
            });
            const [newAnswer, created] = await answer.findOrCreate({
                where: { questionId: questionId },
                defaults: {
                    title: title,
                    content: content,
                    questionId: questionId,
                    writer: writer,
                },
            });
            saveAnswer.isAnswer = true;
            saveAnswer.save();
            if (!created) {
                newAnswer.title = title;
                newAnswer.content = content;
                newAnswer.writer = writer;
                newAnswer.save();
                return res
                    .status(200)
                    .send({ data: null, message: "수정 완료" });
            }

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

            return res.status(200).send({ data: null, message: "등록 완료" });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ data: null, message: "등록 실패" });
        }
    },
    questionEdit: async (req, res) => {
        const authorization = req.headers.authorization;
        let admin = await token.storeCheck(authorization);
        if (!admin) {
            return res.status(403).send({
                data: null,
                message: "유효하지 않은 토큰 입니다.",
            });
        }
        const { title, content, questionId } = req.body;
        try {
            const saveAnswer = await question.findOne({
                where: { id: questionId ? questionId : "" },
            });
            if (saveAnswer) {
                saveAnswer.title = title;
                saveAnswer.content = content;
                await saveAnswer.save();

                return res
                    .status(200)
                    .send({ data: null, message: "수정 완료" });
            }
            return res
                .status(400)
                .send({ data: null, message: "없는 게시글 입니다" });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ data: error, message: "오류" });
        }
    },
    questionList: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            let admin = await token.storeCheck(authorization);
            if (!admin) {
                return res.status(403).send({
                    data: null,
                    message: "유효하지 않은 토큰 입니다.",
                });
            }
            const { word, date, state, limit, pageNum } = req.query;
            let offset = 0;

            if (pageNum > 1) {
                offset = limit * (pageNum - 1);
            }
            if (
                word === undefined ||
                date === undefined ||
                state === undefined ||
                limit === undefined ||
                pageNum === undefined
            ) {
                return res.status(400).send({
                    data: null,
                    message: "쿼리항목이 빠져 있습니다",
                });
            }
            let stateArr = state.split(",");
            stateArr = stateArr.map((el) => {
                if (el === "답변대기") {
                    return false;
                }
                if (el === "답변완료") {
                    return true;
                }
            });
            let result;
            if (!state) {
                return res
                    .status(400)
                    .send({ data: null, message: "결제상태를 입력해주세요" });
            }

            if (date) {
                let [start, end] = date.split("~");
                start = !start ? "1970-01-01" : start;
                let startDay = new Date(start);
                startDay.setHours(startDay.getHours() - 9);
                let endDay = new Date(end);
                endDay.setHours(endDay.getHours() + 15);
                if (!word) {
                    result = await question.findAndCountAll({
                        where: {
                            isShow: true,
                            createdAt: {
                                [Op.between]: [startDay, endDay],
                            },
                            isAnswer: {
                                [Op.or]: stateArr, //["정산문의","결제문의","기타"]
                            },
                        },

                        limit: Number(limit),
                        offset: Number(offset),
                        order: [["createdAt", "DESC"]],
                        include: [
                            {
                                model: answer,
                            },
                            {
                                model: user,
                                attributes: ["userName"],
                            },
                        ],
                    });
                    if (result) {
                        result.total = (await question.count({
                            where: { isShow: true },
                        }))
                            ? await question.count({ where: { isShow: true } })
                            : 0;
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
                if (word) {
                    result = await question.findAndCountAll({
                        where: {
                            isShow: true,
                            [Op.or]: [
                                {
                                    title: {
                                        [Op.like]: "%" + word + "%",
                                    },
                                },
                                {
                                    content: {
                                        [Op.like]: "%" + word + "%",
                                    },
                                },
                            ],
                            createdAt: {
                                [Op.between]: [startDay, endDay],
                            },
                            isAnswer: {
                                [Op.or]: stateArr, //["정산문의","결제문의","기타"]
                            },
                        },
                        limit: Number(limit),
                        offset: Number(offset),
                        order: [["createdAt", "DESC"]],
                        include: [
                            {
                                model: answer,
                            },
                            {
                                model: user,
                                attributes: ["userName"],
                            },
                        ],
                    });
                    if (result) {
                        result.total = (await question.count({
                            where: { isShow: true },
                        }))
                            ? await question.count({ where: { isShow: true } })
                            : 0;
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
            }

            if (!date && word) {
                result = await question.findAndCountAll({
                    where: {
                        isShow: true,
                        [Op.or]: [
                            {
                                title: {
                                    [Op.like]: "%" + word + "%",
                                },
                            },
                            {
                                content: {
                                    [Op.like]: "%" + word + "%",
                                },
                            },
                        ],
                        isAnswer: {
                            [Op.or]: stateArr,
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                    include: [
                        {
                            model: answer,
                        },
                        {
                            model: user,
                            attributes: ["userName"],
                        },
                    ],
                });
                result.total = (await question.count({
                    where: { isShow: true },
                }))
                    ? await question.count({ where: { isShow: true } })
                    : 0;
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
            if (!word && !date) {
                result = await question.findAndCountAll({
                    where: {
                        isShow: true,
                        isAnswer: {
                            [Op.or]: stateArr,
                        },
                    },
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                    include: [
                        {
                            model: answer,
                        },
                        {
                            model: user,
                            attributes: ["userName"],
                        },
                    ],
                });
                result.total = (await question.count({
                    where: { isShow: true },
                }))
                    ? await question.count({ where: { isShow: true } })
                    : 0;
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
};
