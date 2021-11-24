const { Request, Response } = require("express");
const storeQuestion = require("../../models/index.js").storeQuestion;
const storeAnswer = require("../../models/index.js").storeAnswer;
const store = require("../../models/index.js").store;
const token = require("../../modules/token");
const { Op } = require("sequelize");

module.exports = {
    storeQuestion: async (req, res) => {
        try {
            //관리자 확인
            const authorization = req.headers.authorization;
            let admin = await token.storeCheck(authorization);
            if (!admin) {
                return res.status(403).send({
                    data: null,
                    message: "유효하지 않은 토큰 입니다.",
                });
            }
            const { word, date, state, isAnswer, limit, pageNum } = req.query;
            let offset = 0;
            console.log(state);
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
            let answerArr = isAnswer.split(",").map((el) => {
                if (el === "답변대기") {
                    return false;
                } else {
                    return true;
                }
            });
            console.log(stateArr);
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
                            delete: false,
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
                                attributes: ["name"],
                            },
                        ],
                    });
                    if (result) {
                        result.total = (await storeQuestion.count({
                            where: { delete: false },
                        }))
                            ? await storeQuestion.count({
                                  where: { delete: false },
                              })
                            : 0;
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
                if (word) {
                    result = await storeQuestion.findAndCountAll({
                        where: {
                            delete: false,
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
                                attributes: ["name"],
                            },
                        ],
                    });
                    if (result) {
                        result.total = (await storeQuestion.count({
                            where: { delete: false },
                        }))
                            ? await storeQuestion.count({
                                  where: { delete: false },
                              })
                            : 0;
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
            }

            if (!date && word) {
                result = await storeQuestion.findAndCountAll({
                    where: {
                        delete: false,
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
                            attributes: ["name"],
                        },
                    ],
                });
                result.total = (await storeQuestion.count({
                    where: { delete: false },
                }))
                    ? await storeQuestion.count({ where: { delete: false } })
                    : 0;
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
            if (!word && !date) {
                result = await storeQuestion.findAndCountAll({
                    where: {
                        delete: false,
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
                            attributes: ["name"],
                        },
                    ],
                });
                result.total = (await storeQuestion.count({
                    where: { delete: false },
                }))
                    ? await storeQuestion.count({ where: { delete: false } })
                    : 0;
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
            let admin = await token.storeCheck(authorization);
            if (!admin) {
                return res.status(403).send({
                    data: null,
                    message: "유효하지 않은 토큰 입니다.",
                });
            }
            const { id } = req.body;
            try {
                let find = await storeQuestion.findOne({
                    where: { id: id },
                });
                find.delete = true;
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
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                data: null,
                message: "삭제 실패",
            });
        }
    },
    answer: async (req, res) => {
        const authorization = req.headers.authorization;
        let admin = await token.storeCheck(authorization);
        if (!admin) {
            return res.status(403).send({
                data: null,
                message: "유효하지 않은 토큰 입니다.",
            });
        }
        const { title, content, questionId, writer } = req.body;
        console.log(req.body);
        try {
            const findQuestion = await storeQuestion.findOne({
                where: { id: questionId },
            });
            const [newAnswer, created] = await storeAnswer.findOrCreate({
                where: { storeQuestionId: questionId },
                defaults: {
                    title: title,
                    content: content,
                    storeQuestionId: questionId,
                    writer: writer,
                },
            });
            findQuestion.isAnswer = true;
            findQuestion.save();
            if (!created) {
                newAnswer.title = title;
                newAnswer.content = content;
                newAnswer.writer = writer;
                newAnswer.save();
                return res
                    .status(200)
                    .send({ data: null, message: "수정 완료" });
            }

            return res.status(200).send({ data: null, message: "등록 완료" });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ data: null, message: "등록 실패" });
        }
    },
};
