const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const store = require("../../models/index.js").store;
const transaction = require("../../models/index.js").transaction;
const alarm = require("../../models/index.js").alarm;
const excel = require("../admin/excel");
const { Op } = require("sequelize");
const axios = require("axios");
const FormData = require("form-data");
const token = require("../token/accessToken");
const pushEvent = require("../push");
require("dotenv").config();

module.exports = {
    search: async (req, res) => {
        try {
            //관리자 확인
            const authorization = req.headers.authorization;
            let storeId = await token.storeCheck(authorization);
            if (!storeId) {
                return res
                    .status(403)
                    .send({ data: null, message: "만료된 토큰입니다" });
            }
            const { name, date, state, limit, pageNum } = req.query;
            let offset = 0;

            if (pageNum > 1) {
                offset = limit * (pageNum - 1);
            }
            if (
                name === undefined ||
                date === undefined ||
                state === undefined
            ) {
                res.status(400).send({
                    data: null,
                    message: "쿼리항목이 빠져 있습니다",
                });
            }
            let stateArr = state.split(",");
            let result = {};

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
                if (!name) {
                    result = await transaction.findAndCountAll({
                        where: {
                            storeId: storeId,
                            createdAt: {
                                [Op.between]: [startDay, endDay],
                            },
                            state: {
                                [Op.or]: stateArr, //["결제완료","결제실패","결제취소"]
                            },
                        },
                        include: [
                            {
                                model: user,
                                attributes: ["userName"],
                            },
                        ],
                        order: [["createdAt", "DESC"]],
                        limit: Number(limit),
                        offset: Number(offset),
                    });
                    if (result) {
                        result.total = (await transaction.count())
                            ? await transaction.count()
                            : 0;
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
                if (name) {
                    result = await transaction.findAndCountAll({
                        where: {
                            storeId: storeId,
                            createdAt: {
                                [Op.between]: [startDay, endDay],
                            },
                            state: {
                                [Op.or]: stateArr, //["결제완료","결제실패","결제취소"]
                            },
                        },
                        order: [["createdAt", "DESC"]],
                        include: [
                            {
                                model: user,
                                where: {
                                    userName: { [Op.like]: "%" + name + "%" },
                                },
                                attributes: ["userName"],
                            },
                        ],
                        limit: Number(limit),
                        offset: Number(offset),
                    });
                    if (result) {
                        result.total = (await transaction.count())
                            ? await transaction.count()
                            : 0;
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                }
            }

            if (!date && name) {
                result = await transaction.findAndCountAll({
                    where: {
                        storeId: storeId,
                        state: {
                            [Op.or]: stateArr, //["결제완료","결제실패","결제취소"]
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    include: [
                        {
                            model: user,
                            where: {
                                userName: { [Op.like]: "%" + name + "%" },
                            },
                            attributes: ["userName"],
                        },
                    ],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                result.total = (await transaction.count({
                    where: { storeId: storeId },
                }))
                    ? await transaction.count({ where: { storeId: storeId } })
                    : 0;
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
            if (!name && !date) {
                result = await transaction.findAndCountAll({
                    where: {
                        storeId: storeId,
                        state: {
                            [Op.or]: stateArr, //["결제완료","결제실패","결제취소"]
                        },
                    },
                    order: [["createdAt", "DESC"]],
                    include: [
                        {
                            model: user,
                            attributes: ["userName"],
                        },
                    ],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                result.total = (await transaction.count({
                    where: { storeId: storeId },
                }))
                    ? await transaction.count({ where: { storeId: storeId } })
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
    transaction: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            //let storeUserId = await token.storeCheck(authorization);
            //정보 리스트
            let storeId = await token.storeCheck(authorization);
            if (!storeId) {
                return res
                    .status(403)
                    .send({ data: null, message: "만료된 토큰입니다" });
            }

            const { year, month, limit, pageNum } = req.query;
            let offset = 0;

            if (pageNum > 1) {
                offset = limit * (pageNum - 1);
            }
            let from = Number(month) - 1;
            let to = Number(month);
            const startOfMonth = new Date(year, from, 1);
            const endOfMonth = new Date(year, to, 0);
            endOfMonth.setDate(endOfMonth.getDate() + 1);

            let transactionData = await transaction.findAndCountAll({
                where: {
                    storeId: storeId,
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                    state: "결제완료",
                },
                include: [
                    {
                        model: user,
                        attributes: ["userName"],
                    },
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [["createdAt", "DESC"]],
                attributes: ["id", "createdAt", "price", "gMoney"],
            });
            let totalPrice = await transaction.sum("price", {
                where: {
                    storeId: storeId,
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                    state: "결제완료",
                },
            });
            let totalgMoney = await transaction.sum("gMoney", {
                where: {
                    storeId: storeId,
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                    state: "결제완료",
                },
            });

            let total = (await totalPrice) * 0.98 - (totalPrice - totalgMoney);

            return res.status(200).send({
                data: transactionData,
                total: total,
                message: "전체 내역 출력",
            });
        } catch (error) {
            console.log(error);
            res.status(400).send({ data: null, message: error.message });
        }
    },
    cancel: async (req, res) => {
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
                    let find = await transaction.findOne({
                        where: { id: id },
                        include: [
                            {
                                model: user,
                                attributes: ["gMoney", "id", "fcmToken"],
                            },
                            {
                                model: store,
                                attributes: ["name", "id"],
                            },
                        ],
                        attributes: [
                            "state",
                            "cancelDate",
                            "userId",
                            "id",
                            "couponData",
                            "gMoney",
                        ],
                    });
                    if (find) {
                        let data = new FormData();
                        data.append("userId", find.userId);
                        data.append("orderNo", find.id);
                        data.append("couponCode", find.couponData);

                        let config = {
                            method: "post",
                            url: `${process.env.PY_API}/admin/buycancel`,
                            headers: {
                                ...data.getHeaders(),
                            },
                            data: data,
                        };

                        let result = await axios(config);

                        if (result.data.message === "취소 완료") {
                            find.state = "결제취소";
                            find.cancelDate = new Date();
                            find.user.gMoney = find.user.gMoney + find.gMoney;
                            await find.user.save();
                            await find.save();
                            let contents = {
                                title: "결제취소 안내",
                                body:
                                    find.store.name +
                                    "에서 결제하신 \n" +
                                    find.gMoney +
                                    "광이 취소 되었습니다.\n" +
                                    "결제시 이용하신 포인트나 쿠폰정보는 \n" +
                                    "내 정보 보기를 이용해주세요",
                            };
                            await alarm.create({
                                userId: find.userId,
                                title: contents.title,
                                content: contents.body,
                            });
                            pushEvent.data("/user/info", find.user.fcmToken);
                            pushEvent.noti(contents, find.user.fcmToken);
                            return res.status(200).send({
                                data: null,
                                message: "취소 완료",
                            });
                        } else {
                            return res.status(200).send({
                                data: null,
                                message: "기존정보와 연동에 실패하였습니다",
                            });
                        }
                    } else {
                        return res.status(200).send({
                            data: null,
                            message: "해당하는 거래 내역을 찾을수 없습니다",
                        });
                    }
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
                message: "취소중 에러가 발생하였습니다.",
            });
        }
    },
    download: async (req, res) => {
        try {
            console.log(req.headers);
            const authorization = req.headers.authorization;
            let storeId = await token.storeCheck(authorization);
            const { year, month } = req.query;
            let from = Number(month) - 1;
            let to = Number(month);
            const startOfMonth = new Date(year, from, 1);
            const endOfMonth = new Date(year, to, 0);
            endOfMonth.setDate(endOfMonth.getDate() + 1);
            let transactionData = await transaction.findAll({
                where: {
                    storeId: storeId,
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                    state: "결제완료",
                },
                include: [
                    {
                        model: user,
                        attributes: ["userName"],
                    },
                ],
                order: [["createdAt", "DESC"]],
                attributes: ["id", "createdAt", "price", "gMoney"],
            });
            let totalPrice = await transaction.sum("price", {
                where: {
                    storeId: storeId,
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                    state: "결제완료",
                },
            });
            let totalgMoney = await transaction.sum("gMoney", {
                where: {
                    storeId: storeId,
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                    state: "결제완료",
                },
            });

            let total = (await totalPrice) * 0.98 - (totalPrice - totalgMoney);

            let raw = { arr: transactionData, total: total };
            await excel(raw, req, res);
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                data: null,
                message: "에러가 발생하였습니다.",
            });
        }
    },
};
