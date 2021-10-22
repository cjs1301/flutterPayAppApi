const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const charge = require("../../models/index.js").charge;
var moment = require("moment");
const { Op } = require("sequelize");

module.exports = {
    give: async (req, res) => {},
    chargeSearch: async (req, res) => {
        //약정충전 리스트 검색
        let admin;
        //관리자 확인
        const { name, date, state } = req.query;

        console.log("이름----", name, "날짜----", date, "상태----", state);

        if (name === undefined || date === undefined || state === undefined) {
            res.status(400).send({
                data: null,
                message: "쿼리항목이 빠져 있습니다",
            });
        }

        let regState = state.replace(/["']/g, "");

        let stateArr = regState.split(",");

        let result;
        if (state === "") {
            try {
                return res.send({
                    data: null,
                    message: "충전상태를 입력해주세요",
                });
            } catch (error) {
                console.log(error);
            }
        }

        if (date === "" && name !== "") {
            try {
                result = await charge.findAll({
                    where: {
                        userName: {
                            [Op.like]: `%${name}%`,
                        },
                        state: {
                            [Op.or]: stateArr, //["충전신청","입금완료","입금미완료","충전완료"]
                        },
                    },
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료1" });
            } catch (error) {
                console.log(error);
            }
        }
        if (date === "" && name === "") {
            try {
                result = await charge.findAll({
                    where: {
                        state: {
                            [Op.or]: stateArr, //["충전신청","입금완료","입금미완료","충전완료"]
                        },
                    },
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료2" });
            } catch (error) {
                console.log(error);
            }
        }

        let dateArr = date.split(",");
        let startMonth = new Date(dateArr[0]);
        let endMonth = new Date(dateArr[1]);
        endMonth.setDate(endMonth.getDate() + 1);
        console.log(typeof startMonth, endMonth);

        if (name === "" && date !== "") {
            try {
                result = await charge.findAll({
                    where: {
                        createdAt: {
                            [Op.lt]: endMonth,
                            [Op.gt]: startMonth,
                        },
                        state: {
                            [Op.or]: stateArr, //["충전신청","입금완료","입금미완료","충전완료"]
                        },
                    },
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료3" });
            } catch (error) {
                console.log(error);
            }
        }
        console.log(date, name, "상태 확인~~~~~~~~~~~");
        if (name !== "" && date !== "") {
            try {
                result = await charge.findAll({
                    where: {
                        createdAt: {
                            [Op.lt]: endMonth,
                            [Op.gt]: startMonth,
                        },
                        userName: {
                            [Op.like]: `%${name}%`,
                        },
                        state: {
                            [Op.or]: stateArr, //["충전신청","입금완료","입금미완료","충전완료"]
                        },
                    },
                });
                return res
                    .status(200)
                    .send({ data: result, message: "검색 완료4" });
            } catch (error) {
                console.log(error);
            }
        }
    },
    subscriptionSearch: async (req, res) => {
        let admin;
        //관리자 확인

        const { name, date, state } = req.query;
        let day = moment().format(`DD`);
        let month = moment().format(`MM`);
        let year = date;
        let startMonth = new Date(`${year}-${month - 1}-${day}`);
        let endMonth = new Date();
        let result;
        if (name === null && date !== null) {
            result = await charge.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startMonth, endMonth],
                    },
                    state: {
                        [Op.or]: [...state], //["충전신청","입금완료","입금미완료","충전완료"]
                    },
                },
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (date === null && name !== null) {
            result = await charge.findAll({
                where: {
                    userName: name,
                    state: {
                        [Op.or]: [...state], //["충전신청","입금완료","입금미완료","충전완료"]
                    },
                },
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (name === null && date === null) {
            result = await charge.findAll({
                where: {
                    state: {
                        [Op.or]: [...state], //["충전신청","입금완료","입금미완료","충전완료"]
                    },
                },
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (state === null) {
            return res.send({ data: null, message: "충전상태를 입력해주세요" });
        }
    },
};
