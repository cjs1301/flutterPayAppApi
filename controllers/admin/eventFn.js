const { Request, Response } = require("express");
const alarm = require("../../models/index.js").alarm;
const { Op } = require("sequelize");
const pushEvent = require("../../controllers/push");
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
                        isShow: true,
                        startDate: {
                            [Op.between]: [startDay, endDay],
                        },
                        state: state,
                    },
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        isShow: true,
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
                    order: [["createdAt", "DESC"]],
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
                where: {
                    isShow: true,
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
                order: [["createdAt", "DESC"]],
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    isShow: true,
                    state: state,
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [["createdAt", "DESC"]],
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
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
                        isShow: true,
                        endDate: {
                            [Op.between]: [startDay, endDay],
                        },
                        state: state,
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        isShow: true,
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
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
                where: {
                    isShow: true,
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
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    isShow: true,
                    state: state,
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
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
                        isShow: true,
                        createdAt: {
                            [Op.between]: [startDay, endDay],
                        },
                        state: state,
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        isShow: true,
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
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
                where: {
                    isShow: true,
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
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    isShow: true,
                    state: state,
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
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
                        isShow: true,
                        startDate: {
                            [Op.between]: [startDay, endDay],
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        isShow: true,
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
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
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
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: { isShow: true },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
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
                        isShow: true,
                        endDate: {
                            [Op.between]: [startDay, endDay],
                        },
                    },
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        isShow: true,
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
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
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
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: { isShow: true },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
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
                        isShow: true,
                        createdAt: {
                            [Op.between]: [startDay, endDay],
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        isShow: true,
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
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { isShow: true },
                    }))
                        ? await event.count({ where: { isShow: true } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        }

        if (!date && word) {
            result = await event.findAndCountAll({
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
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: { isShow: true },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { isShow: true } }))
                ? await event.count({ where: { isShow: true } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
};
