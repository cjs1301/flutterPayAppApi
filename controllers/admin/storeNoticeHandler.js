const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const storeNotice = require("../../models/index.js").storeNotice;
const alarm = require("../../models/index.js").alarm;
const { Op } = require("sequelize");
const pushEvent = require("../../controllers/push");

module.exports = {
    notice: async (req, res) => {
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
                    result = await storeNotice.findAndCountAll({
                        where: {
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
                    result = await storeNotice.findAndCountAll({
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
                            createdAt: {
                                [Op.between]: [startDay, endDay],
                            },
                        },
                        order: [["createdAt", "DESC"]],
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
                result = await storeNotice.findAndCountAll({
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
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
            if (!word && !date) {
                result = await storeNotice.findAndCountAll({
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
            return res.send("이게안되나");
        }
    },
    uploadEdit: async (req, res) => {
        try {
            const { title, content, isShow, id } = req.body;

            if (
                title === undefined ||
                content === undefined ||
                isShow === undefined
            ) {
                res.status(400).send({
                    data: null,
                    message: "항목이 빠져 있습니다",
                });
            }

            if (id) {
                let findNotice = await storeNotice.findOne({
                    where: { id: id },
                });
                if (findNotice) {
                    findNotice.scontenttate = content;
                    findNotice.title = title;
                    findNotice.isShow = isShow;
                    findEvent.save();
                }
                return res.status(400).send({
                    data: null,
                    message: "해당글은 없는 글입니다.",
                });
            }

            await storeNotice.create({
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
            return res.send("이게안되나");
        }
    },
    delete: async (req, res) => {
        const { id } = req.body;
        const del = await storeNotice.findOne({ where: { id: id } });
        del.isShow = false;
        await del.save();
        res.status(200).send({
            data: null,
            message: "성공적으로 삭제 하였습니다.",
        });
    },
};
