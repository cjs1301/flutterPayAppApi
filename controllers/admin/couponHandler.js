const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const answer = require("../../models/index.js").answer;
const alarm = require("../../models/index.js").alarm;
const { Op } = require("sequelize");
const pushEvent = require("../../controllers/push");

module.exports = {
    giveCoupon: async (req, res) => {
        const { userName, userPhoneNumber } = req.body;
    },
    couponSearch: async (req, res) => {
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
            result = await transaction.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startMonth, endMonth],
                    },
                    state: {
                        [Op.or]: [...state], //["결제완료","결제실패","결제취소"]
                    },
                },
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (date === null && name !== null) {
            result = await transaction.findAll({
                where: {
                    userName: name,
                    state: {
                        [Op.or]: [...state], //["결제완료","결제실패","결제취소"]
                    },
                },
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (name === null && date === null) {
            result = await transaction.findAll({
                where: {
                    state: {
                        [Op.or]: [...state], //["결제완료","결제실패","결제취소"]
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
