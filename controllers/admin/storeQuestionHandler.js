const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const storeQuestion = require("../../models/index.js").storeQuestion;
const storeAnswer = require("../../models/index.js").storeAnswer;
const store = require("../../models/index.js").store;
const alarm = require("../../models/index.js").alarm;
const { Op } = require("sequelize");
const pushEvent = require("../../controllers/push");

module.exports = {
    storeQuestion: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            //관리자 확인

            const { word, date, state, isAnswer, limit, pageNum } = req.query;
            let offset = 0;
            console.log(isAnswer);
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
                res.status(400).send({
                    data: null,
                    message: "쿼리항목이 빠져 있습니다",
                });
            }
            let stateArr = state.split(",");
            let answerArr = isAnswer.split(",").map((el) => {
                if (el === "답변대기") {
                    return false;
                } else {
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
                    result = await storeQuestion.findAndCountAll({
                        where: {
                            isShow: true,
                            isAnswer: { [Op.or]: answerArr },
                            createdAt: {
                                [Op.between]: [startDay, endDay],
                            },
                            state: {
                                [Op.or]: stateArr, //["정산문의","결제문의","기타"]
                            },
                        },

                        limit: Number(limit),
                        offset: Number(offset),
                        order: [["createdAt", "DESC"]],
                        include: [
                            {
                                model: storeAnswer,
                            },
                            {
                                model: store,
                                attributes: ["ceo"],
                            },
                        ],
                    });
                    if (result) {
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
                if (word) {
                    result = await storeQuestion.findAndCountAll({
                        where: {
                            isShow: true,
                            isAnswer: { [Op.or]: answerArr },
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
                            state: {
                                [Op.or]: stateArr, //["정산문의","결제문의","기타"]
                            },
                        },
                        order: [["createdAt", "DESC"]],
                        limit: Number(limit),
                        offset: Number(offset),
                        include: [
                            {
                                model: storeAnswer,
                            },
                            {
                                model: store,
                                attributes: ["ceo"],
                            },
                        ],
                    });
                    if (result) {
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
            }

            if (!date && word) {
                result = await storeQuestion.findAndCountAll({
                    where: {
                        isShow: true,
                        isAnswer: { [Op.or]: answerArr },
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
                        state: {
                            [Op.or]: stateArr, //["정산문의","결제문의","기타"]
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                    include: [
                        {
                            model: storeAnswer,
                        },
                        {
                            model: store,
                            attributes: ["ceo"],
                        },
                    ],
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
            if (!word && !date) {
                result = await storeQuestion.findAndCountAll({
                    where: {
                        isShow: true,
                        isAnswer: { [Op.or]: answerArr },
                        state: {
                            [Op.or]: stateArr, //["정산문의","결제문의","기타"]
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                    include: [
                        {
                            model: storeAnswer,
                        },
                        {
                            model: store,
                            attributes: ["ceo"],
                        },
                    ],
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            let storeId = await token.storeCheck(authorization);
            if (!storeId) {
                //실패
                return res
                    .status(403)
                    .send({ data: null, message: "만료된 토큰입니다" });
            } else {
                //성공
                const { id } = req.body;
                try {
                    let find = await storeQuestion.findOne({
                        where: { id: id },
                    });
                    find.isShow = false;
                    await find.save();
                    return res.status(200).send({
                        data: null,
                        message: "삭제 완료",
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(403).send({
                        data: null,
                        message: "일치하는 회원정보를 찾지 못했습니다",
                    });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                data: null,
                message: "질문리스트를 받아오는중 에러가 생겼습니다",
            });
        }
    },
    answer: async (req, res) => {
        const { title, content, questionId } = req.body;
        console.log(req.body);
        const saveAnswer = await storeQuestion.findOne({
            where: { id: questionId },
            include: [
                {
                    model: storeAnswer,
                },
            ],
        });
        if (!saveAnswer.storeAnswer) {
            const newAnswer = await storeAnswer.create({
                title: title,
                content: content,
                storeQuestionId: questionId,
            });

            saveAnswer.isAnswer = true;
            saveAnswer.save();

            return res.status(200).send({ data: null, message: "등록 완료" });
        } else {
            saveAnswer.storeAnswer.title = title;
            saveAnswer.storeAnswer.content = content;
            await saveAnswer.storeAnswer.save();
            return res.status(200).send({ data: null, message: "수정 완료" });
        }
    },
};
