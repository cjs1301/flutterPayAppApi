const { Request, Response } = require("express");
const { Op } = require("sequelize");
const event = require("../../models/index.js").event;

module.exports = {
    start: async (word, date, state, limit, offset, result, res) => {
        if (date) {
            let [start, end] = date.split("~");
            start = !start ? "1970-01-01" : start;
            let startDay = new Date(start);
            startDay.setHours(startDay.getHours() - 9);
            let endDay = new Date(end);
            endDay.setHours(endDay.getHours() + 15);
            if (!word) {
                result = await event.findAndCountAll({
                    where: {
                        startDate: {
                            [Op.between]: [startDay, endDay],
                        },
                        state: state,
                    },
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        startDate: {
                            [Op.between]: [startDay, endDay],
                        },
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
                        state: state,
                    },
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
                where: {
                    state: {
                        [Op.or]: stateArr, //["시작전,진행중,종료"]
                    },
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
                },
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            console.log("여기", date);
            result = await event.findAndCountAll({
                where: {
                    state: state,
                },
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    end: async (word, date, state, limit, offset, result, res) => {
        if (date) {
            let [start, end] = date.split("~");
            start = !start ? "1970-01-01" : start;
            let startDay = new Date(start);
            startDay.setHours(startDay.getHours() - 9);
            let endDay = new Date(end);
            endDay.setHours(endDay.getHours() + 15);
            if (!word) {
                result = await event.findAndCountAll({
                    where: {
                        endDate: {
                            [Op.between]: [startDay, endDay],
                        },
                        state: state,
                    },
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        endDate: {
                            [Op.between]: [startDay, endDay],
                        },
                        state: state,
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
                    },
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
                where: {
                    state: state,
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
                },
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            console.log("여기", date);
            result = await event.findAndCountAll({
                where: {
                    state: state,
                },
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    created: async (word, date, state, limit, offset, result, res) => {
        if (date) {
            let [start, end] = date.split("~");
            start = !start ? "1970-01-01" : start;
            let startDay = new Date(start);
            startDay.setHours(startDay.getHours() - 9);
            let endDay = new Date(end);
            endDay.setHours(endDay.getHours() + 15);
            if (!word) {
                result = await event.findAndCountAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startDay, endDay],
                        },
                        state: state,
                    },
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startDay, endDay],
                        },
                        state: state,
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
                    },
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await transaction.findAndCountAll({
                where: {
                    state: state,
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
                },
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            console.log("여기", date);
            result = await transaction.findAndCountAll({
                where: {
                    state: state,
                },
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },

    startAll: async (word, date, limit, offset, result, res) => {
        if (date) {
            let [start, end] = date.split("~");
            start = !start ? "1970-01-01" : start;
            let startDay = new Date(start);
            startDay.setHours(startDay.getHours() - 9);
            let endDay = new Date(end);
            endDay.setHours(endDay.getHours() + 15);
            if (!word) {
                result = await event.findAndCountAll({
                    where: {
                        startDate: {
                            [Op.between]: [startDay, endDay],
                        },
                    },
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        startDate: {
                            [Op.between]: [startDay, endDay],
                        },
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
                    },
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
                where: {
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
                },
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            console.log("여기", date);
            result = await event.findAndCountAll({
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    endAll: async (word, date, limit, offset, result, res) => {
        if (date) {
            let [start, end] = date.split("~");
            start = !start ? "1970-01-01" : start;
            let startDay = new Date(start);
            startDay.setHours(startDay.getHours() - 9);
            let endDay = new Date(end);
            endDay.setHours(endDay.getHours() + 15);
            if (!word) {
                result = await event.findAndCountAll({
                    where: {
                        endDate: {
                            [Op.between]: [startDay, endDay],
                        },
                    },
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        endDate: {
                            [Op.between]: [startDay, endDay],
                        },
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
                    },
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
                where: {
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
                },
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            console.log("여기", date);
            result = await event.findAndCountAll({
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    createdAll: async (word, date, limit, offset, result, res) => {
        if (date) {
            let [start, end] = date.split("~");
            start = !start ? "1970-01-01" : start;
            let startDay = new Date(start);
            startDay.setHours(startDay.getHours() - 9);
            let endDay = new Date(end);
            endDay.setHours(endDay.getHours() + 15);
            if (!word) {
                result = await event.findAndCountAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startDay, endDay],
                        },
                    },
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startDay, endDay],
                        },
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
                    },
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await transaction.findAndCountAll({
                where: {
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
                },
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            console.log("여기", date);
            result = await transaction.findAndCountAll({
                order: [["updatedAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
};
