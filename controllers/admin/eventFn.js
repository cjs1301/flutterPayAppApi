const { Request, Response } = require("express");
const { Op } = require("sequelize");
const event = require("../../models/index.js").event;

module.exports = {
    start1: async (word, date, limit, offset, result, res) => {
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
                        delete: false,
                        startDate: {
                            [Op.and]:{
                                [Op.between]: [startDay, endDay],
                            }
                        },
                    },
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                if (result) {
                    result.total = (await event.count({
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                if (result) {
                    result.total = (await event.count({
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    delete: false,
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [["createdAt", "DESC"]],
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    end1: async (word, date, limit, offset, result, res) => {
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
                        delete: false,
                        endDate: {
                            [Op.between]: [startDay, endDay],
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    delete: false,
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    created1: async (word, date, limit, offset, result, res) => {
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
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    delete: false,
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },

    start2: async (word, date, limit, offset, result, res) => {
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
                        delete: false,
                        startDate: {
                            [Op.and]:{
                                [Op.between]: [startDay, endDay],
                            }
                        },
                    },
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                if (result) {
                    result.total = (await event.count({
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                if (result) {
                    result.total = (await event.count({
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    delete: false,
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [["createdAt", "DESC"]],
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    end2: async (word, date, limit, offset, result, res) => {
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
                        delete: false,
                        endDate: {
                            [Op.between]: [startDay, endDay],
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    delete: false,
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    created2: async (word, date, limit, offset, result, res) => {
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
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    delete: false,
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    
    start3: async (word, date, limit, offset, result, res) => {
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
                        delete: false,
                        startDate: {
                            [Op.and]:{
                                [Op.between]: [startDay, endDay],
                            }
                        },
                    },
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                if (result) {
                    result.total = (await event.count({
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                if (result) {
                    result.total = (await event.count({
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    delete: false,
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [["createdAt", "DESC"]],
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    end3: async (word, date, limit, offset, result, res) => {
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
                        delete: false,
                        endDate: {
                            [Op.between]: [startDay, endDay],
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    result.total = (await event.count({
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    delete: false,
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
    created3: async (word, date, limit, offset, result, res) => {
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
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: {
                    delete: false,
                },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
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
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: { delete: false },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
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
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: { delete: false },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
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
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
                        : 0;
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
            if (word) {
                result = await event.findAndCountAll({
                    where: {
                        delete: false,
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
                        where: { delete: false },
                    }))
                        ? await event.count({ where: { delete: false } })
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
                    delete: false,
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
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (!word && !date) {
            result = await event.findAndCountAll({
                where: { delete: false },
                order: [["createdAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
            });
            result.total = (await event.count({ where: { delete: false } }))
                ? await event.count({ where: { delete: false } })
                : 0;
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
};
