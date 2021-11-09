const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const charge = require("../../models/index.js").charge;
const subscription = require("../../models/index.js").subscription;
const transaction = require("../../models/index.js").transaction;
const alarm = require("../../models/index.js").alarm;
const { Op } = require("sequelize");
const pushEvent = require("../../controllers/push");

module.exports = {
    chargeSearch: async (req, res) => {
        try {
            //관리자 확인
            //운영자 계정 확인
            const authorization = req.headers.authorization;
            console.log(authorization);
            let adminId = 1;

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

            let result;
            if (!state) {
                return res
                    .status(400)
                    .send({ data: null, message: "결제상태를 입력해주세요" });
            }
            let stateArr = state.split(",");
            if (date) {
                let [start, end] = date.split("~");
                start = !start ? "1970-01-01" : start;
                let startDay = new Date(start);
                startDay.setHours(startDay.getHours() - 9);
                let endDay = new Date(end);
                endDay.setHours(endDay.getHours() + 15);
                if (!name) {
                    result = await charge.findAndCountAll({
                        where: {
                            createdAt: {
                                [Op.between]: [startDay, endDay],
                            },
                            state: {
                                [Op.or]: stateArr, //["충전신청,입금미완료,충전완료"]
                            },
                        },
                        include: [
                            {
                                model: user,
                            },
                        ],
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
                if (name) {
                    result = await charge.findAndCountAll({
                        where: {
                            userName: name,
                            state: {
                                [Op.or]: stateArr, //["충전신청,입금미완료,충전완료"]
                            },
                        },
                        include: [
                            {
                                model: user,
                            },
                        ],
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

            if (!date && name) {
                result = await charge.findAndCountAll({
                    where: {
                        userName: name,
                        state: {
                            [Op.or]: stateArr, //["충전신청,입금미완료,충전완료"]
                        },
                    },
                    include: [
                        {
                            model: user,
                        },
                    ],
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
            if (!name && !date) {
                result = await charge.findAndCountAll({
                    where: {
                        state: {
                            [Op.or]: stateArr, //["충전신청,입금미완료,충전완료,입금완료"]
                        },
                    },
                    include: [
                        {
                            model: user,
                        },
                    ],
                    order: [["updatedAt", "DESC"]],
                    limit: Number(limit),
                    offset: Number(offset),
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료" });
            }
        } catch (error) {
            console.log(error);
        }
    },
    stateChange: async (req, res) => {
        try {
            const { ids, state } = req.body;
            let idsArr = ids.split(",");
            idsArr = idsArr.map((el) => (el = Number(el)));

            let asyncFn = async (id) => {
                let chargeData = await charge.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: user,
                        },
                    ],
                });

                if (chargeData) {
                    switch (state) {
                        case "입금완료":
                            if (
                                chargeData.state === "충전신청" ||
                                chargeData.state === "입금미완료"
                            ) {
                                chargeData.state = "입금완료";
                                await chargeData.save();
                            }
                            break;

                        case "입금미완료":
                            if (chargeData.state === "충전신청") {
                                chargeData.state = "입금미완료";
                                await chargeData.save();
                            }
                            break;

                        case "충전완료":
                            if (chargeData.state === "입금완료") {
                                chargeData.user.gMoney =
                                    chargeData.user.gMoney + chargeData.money;

                                chargeData.state = "충전완료";
                                await transaction.create({
                                    userId: chargeData.userId,
                                    gMoney: chargeData.money,
                                    state: "일반충전",
                                    minus: false,
                                    checkBalance: chargeData.user.gMoney,
                                });
                                let contents = {
                                    title: "충전완료 알림",
                                    body:
                                        "신청하신 " +
                                        chargeData.money +
                                        "화 충전이 완료되었습니다",
                                };
                                pushEvent.data(
                                    "/user/info",
                                    chargeData.user.fcmToken
                                );
                                pushEvent.noti(
                                    contents,
                                    chargeData.user.fcmToken
                                );

                                await alarm.create({
                                    userId: chargeData.user.id,
                                    title: contents.title,
                                    content: contents.body,
                                });
                                await chargeData.user.save();
                                await chargeData.save();
                            }

                            break;
                        default:
                            break;
                    }
                } else {
                    return res
                        .status(500)
                        .send({
                            data: error,
                            message: "신청하신 데이터를 찾을수 없습니다",
                        });
                }
            };
            idsArr.forEach(async (id) => {
                await asyncFn(id);
            });
            return res.status(200).send({
                data: null,
                message: "상태 변경 완료",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ data: error, message: "오류" });
        }
    },
    subscriptionSearch: async (req, res) => {
        try {
            //관리자 확인
            //운영자 계정 확인
            const authorization = req.headers.authorization;
            console.log(authorization);
            let adminId = 1;

            const { name, state, limit, pageNum } = req.query;
            let offset = 0;

            if (pageNum > 1) {
                offset = limit * (pageNum - 1);
            }
            if (state === undefined) {
                res.status(400).send({
                    data: null,
                    message: "쿼리항목이 빠져 있습니다",
                });
            }

            let result;
            if (!state) {
                return res
                    .status(400)
                    .send({ data: null, message: "결제상태를 입력해주세요" });
            }
            let stateArr = state.split(",");
            if (!name) {
                result = await subscription.findAndCountAll({
                    where: {
                        state: {
                            [Op.or]: stateArr, //["신청대기,약정충전진행,해지신청,해지완료"]
                        },
                    },
                    include: [
                        {
                            model: user,
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
            if (name) {
                result = await subscription.findAndCountAll({
                    where: {
                        userName: name,
                        state: {
                            [Op.or]: stateArr, //["신청대기,약정충전진행,해지신청,해지완료"]
                        },
                    },
                    include: [
                        {
                            model: user,
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
    proceeding: async (req, res) => {},
    termination: async (req, res) => {},
};
