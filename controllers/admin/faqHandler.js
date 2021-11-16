const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const faq = require("../../models/index.js").faq;
const alarm = require("../../models/index.js").alarm;
const { Op } = require("sequelize");
const pushEvent = require("../../controllers/push");

module.exports = {
    faq: async (req, res) => {
        try {
            const { word, date, limit, pageNum } = req.query;
            let offset = 0;

            if (pageNum > 1) {
                offset = limit * (pageNum - 1);
            }
            if (word === undefined || date === undefined) {
                res.status(400).send({
                    data: null,
                    message: "쿼리항목이 빠져 있습니다",
                });
            }

            let result;

            if (date) {
                let [start, end] = date.split("~");
                start = !start ? "1970-01-01" : start;
                let startDay = new Date(start);
                startDay.setHours(startDay.getHours() - 9);
                let endDay = new Date(end);
                endDay.setHours(endDay.getHours() + 15);
                if (!word) {
                    result = await faq.findAndCountAll({
                        where: {
                            isShow: true,
                            createdAt: {
                                [Op.between]: [startDay, endDay],
                            },
                        },
                        limit: Number(limit),
                        offset: Number(offset),
                        order: [["createdAt", "DESC"]],
                    });
                    if (result) {
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
                if (word) {
                    result = await faq.findAndCountAll({
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
                        },
                        limit: Number(limit),
                        offset: Number(offset),
                        order: [["createdAt", "DESC"]],
                    });
                    if (result) {
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
            }

            if (!date && word) {
                result = await faq.findAndCountAll({
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
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
            if (!word && !date) {
                result = await faq.findAndCountAll({
                    where: { isShow: true },
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ data: error, message: "오류" });
        }
    },
    uploadEdit: async (req, res) => {
        try {
            const { title, content, isShow, id } = req.body;
            if (!title || !content || isShow === undefined) {
                return res.status(400).send({
                    data: null,
                    message: "항목이 빠져 있습니다",
                });
            }

            if (id) {
                let findfaq = await faq.findOne({
                    where: { id: id },
                });
                if (findfaq) {
                    findfaq.content = content;
                    findfaq.title = title;
                    findfaq.isShow = isShow;
                    findfaq.save();
                }
                return res.status(400).send({
                    data: null,
                    message: "해당글은 없는 글입니다.",
                });
            }

            await faq.create({
                content: content,
                title: title,
                isShow: isShow,
            });

            return res.status(200).send({
                data: null,
                message: "작성 완료",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ data: error, message: "오류" });
        }
    },
    delete: async (req, res) => {
        const { id } = req.body;
        const del = await faq.findOne({ where: { id: id } });
        del.isShow = false;
        await del.save();
        res.status(200).send({
            data: null,
            message: "성공적으로 삭제 하였습니다.",
        });
    },
};
