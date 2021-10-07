const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const charge = require("../../models/index.js").charge;
var moment = require("moment");
const { Op } = require("sequelize");

module.exports = {
    give: async (req, res) => {},
    chargeSearch: async (req, res) => {
        let admin;
        //관리자 확인
        const { name, date, state } = req.query;
        let day = moment().format(`DD`);
        let month = moment().format(`MM`);
        let year = moment().format(`YYYY`);
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
