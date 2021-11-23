const { Request, Response } = require("express");
const { Op } = require("sequelize");
const notice = require("../../models/index.js").notice;
const token = require("../../modules/token");

module.exports = {
    notice: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            let admin = await token.storeCheck(authorization);
            if (!admin) {
                return res.status(403).send({
                    data: null,
                    message: "유효하지 않은 토큰 입니다.",
                });
            }
            const { word, date, limit, pageNum } = req.query;
            let offset = 0;

            if (pageNum > 1) {
                offset = limit * (pageNum - 1);
            }
            if (word === undefined || date === undefined) {
                return res.status(400).send({
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
                    result = await notice.findAndCountAll({
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
                        result.total = (await notice.count({
                            where: { isShow: true },
                        }))
                            ? await notice.count({ where: { isShow: true } })
                            : 0;
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
                if (word) {
                    result = await notice.findAndCountAll({
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
                        result.total = (await notice.count({
                            where: { isShow: true },
                        }))
                            ? await notice.count({ where: { isShow: true } })
                            : 0;
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
            }

            if (!date && word) {
                result = await notice.findAndCountAll({
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
                result.total = (await notice.count({
                    where: { isShow: true },
                }))
                    ? await notice.count({ where: { isShow: true } })
                    : 0;
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
            if (!word && !date) {
                result = await notice.findAndCountAll({
                    where: { isShow: true },
                    limit: Number(limit),
                    offset: Number(offset),
                    order: [["createdAt", "DESC"]],
                });
                result.total = (await notice.count({
                    where: { isShow: true },
                }))
                    ? await notice.count({ where: { isShow: true } })
                    : 0;
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
            const authorization = req.headers.authorization;
            let admin = await token.storeCheck(authorization);
            if (!admin) {
                return res.status(403).send({
                    data: null,
                    message: "유효하지 않은 토큰 입니다.",
                });
            }
            const { title, content, hide, id, writer } = req.body;

            if (!title || !content || hide === undefined) {
                return res.status(400).send({
                    data: null,
                    message: "항목이 빠져 있습니다",
                });
            }

            let [findNotice, created] = await notice.findOrCreate({
                where: { id: id ? id : "" },
                defaults: {
                    content: content,
                    title: title,
                    hide: hide,
                    writer: writer,
                },
            });

            if (!created) {
                findNotice.content = content;
                findNotice.title = title;
                findNotice.hide = hide;
                findNotice.writer = writer;
                await findNotice.save();
                return res.status(200).send({
                    data: null,
                    message: "수정 완료",
                });
            }

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
        const authorization = req.headers.authorization;
        let admin = await token.storeCheck(authorization);
        if (!admin) {
            return res.status(403).send({
                data: null,
                message: "유효하지 않은 토큰 입니다.",
            });
        }
        const { id } = req.body;
        const del = await notice.findOne({ where: { id: id } });
        del.isShow = false;
        await del.save();
        return res.status(200).send({
            data: null,
            message: "성공적으로 삭제 하였습니다.",
        });
    },
};
