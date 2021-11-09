const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const store = require("../../models/index.js").store;
const transaction = require("../../models/index.js").transaction;
const { Op } = require("sequelize");

module.exports = {
    search: async (req, res) => {
        try {
            //관리자 확인
            const authorization = req.headers.authorization;
            let adminId = 1;

            const { date, state, limit, pageNum, storeId } = req.query;

            let offset = 0;
            if (pageNum > 1) {
                offset = limit * (pageNum - 1);
            }
            if (date === undefined || state === undefined) {
                res.status(400).send({
                    data: null,
                    message: "쿼리항목이 빠져 있습니다",
                });
            }
            if (!state) {
                return res
                    .status(400)
                    .send({ data: null, message: "결제상태를 입력해주세요" });
            }
            let stateArr = state.split(",");
            let result;
            let [start, end] = date.split("~");
            start = !start ? "1970-01-01" : start;
            end = !end ? new Date() : end;
            let startDay = new Date(start);
            startDay.setHours(startDay.getHours() - 9);
            let endDay = new Date(end);
            endDay.setHours(endDay.getHours() + 15);
            if (storeId) {
                try {
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
                            {
                                model: store,
                                attributes: ["name"],
                            },
                        ],
                        limit: Number(limit),
                        offset: Number(offset),
                    });
                    if (result) {
                        return res
                            .status(200)
                            .send({ data: result, message: "검색 완료" });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                result = await transaction.findAndCountAll({
                    where: {
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
                        {
                            model: store,
                            attributes: ["name"],
                        },
                    ],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                if (result) {
                    return res
                        .status(200)
                        .send({ data: result, message: "검색 완료" });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    transaction: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            let adminId = 1;

            const { year, month, limit, pageNum, storeId } = req.query;

            let offset = 0;
            if (pageNum > 1) {
                offset = limit * (pageNum - 1);
            }
            let from = Number(month) - 1;
            let to = Number(month);
            const startOfMonth = new Date(year, from, 1);
            const endOfMonth = new Date(year, to, 0);
            endOfMonth.setDate(endOfMonth.getDate() + 1);
            let result = {
                count: 1,
                rows: [],
            };
            if (storeId) {
                let priceData = await transaction.sum("price", {
                    where: {
                        storeId: storeId,
                        createdAt: {
                            [Op.between]: [startOfMonth, endOfMonth],
                        },
                        state: "결제완료",
                    },
                });
                let gMoneyData = await transaction.sum("gMoney", {
                    where: {
                        storeId: storeId,
                        createdAt: {
                            [Op.between]: [startOfMonth, endOfMonth],
                        },
                        state: "결제완료",
                    },
                });

                let storeName = await store.findOne({
                    where: {
                        id: storeId,
                    },
                    attributes: ["name"],
                });
                result.rows.push({
                    id: storeId,
                    storeName: storeName.name,
                    accountall: priceData * 0.98 - (priceData - gMoneyData),
                    pay_money: priceData,
                    fees: priceData * 0.02,
                    deductible_money: priceData - gMoneyData,
                });
                return res
                    .status(200)
                    .send({ data: result, message: "내역 출력" });
            } else {
                let storeData = await store.findAndCountAll({
                    limit: Number(limit),
                    offset: Number(offset),
                    attributes: ["id", "name"],
                });
                for (let el of storeData.rows) {
                    let priceData = await transaction.sum("price", {
                        where: {
                            storeId: el.id,
                            createdAt: {
                                [Op.between]: [startOfMonth, endOfMonth],
                            },
                            state: "결제완료",
                        },
                    });
                    let gMoneyData = await transaction.sum("gMoney", {
                        where: {
                            storeId: el.id,
                            createdAt: {
                                [Op.between]: [startOfMonth, endOfMonth],
                            },
                            state: "결제완료",
                        },
                    });
                    result.rows.push({
                        id: el.id,
                        storeName: el.name,
                        accountall: priceData * 0.98 - (priceData - gMoneyData),
                        pay_money: priceData,
                        fees: priceData * 0.02,
                        deductible_money: priceData - gMoneyData,
                    });
                }

                result.count = storeData.count;
                return res
                    .status(200)
                    .send({ data: result, message: "전체 내역 출력" });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({ data: null, message: error.message });
        }
    },
    storelist: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            let adminId = 1;

            let result = await store.findAll({
                attributes: ["id", "name"],
            });

            return res.status(200).send({ data: result, message: "가게목록" });
        } catch (error) {
            console.log(error);
            res.status(400).send({ data: null, message: error.message });
        }
    },
};
