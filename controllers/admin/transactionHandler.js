const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const transaction = require("../../models/index.js").transaction;

module.exports = {
    search: async (req, res) => {
        let admin;
        //관리자 확인
        const { name, date, state } = req.query;
        let stateArr = state.split(",");
        if (name === undefined || date === undefined || state === undefined) {
            res.status(400).send({
                data: null,
                message: "쿼리항목이 빠져 있습니다",
            });
        }
        let day = moment().format(`DD`);
        let month = moment().format(`MM`);
        let year = moment().format(`YYYY`);
        let startMonth = new Date(`${year}-${month - 1}-${day}`);
        let endMonth = new Date();
        let result;
        if (state === "") {
            return res.send({ data: null, message: "충전상태를 입력해주세요" });
        }
        if (name === "" && date !== "") {
            result = await transaction.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startMonth, endMonth],
                    },
                    state: {
                        [Op.or]: stateArr, //["결제완료","결제실패","결제취소"]
                    },
                },
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (date === "" && name !== "") {
            result = await transaction.findAll({
                where: {
                    userName: name,
                    state: {
                        [Op.or]: stateArr, //["결제완료","결제실패","결제취소"]
                    },
                },
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
        if (name === "" && date === "") {
            result = await transaction.findAll({
                where: {
                    state: {
                        [Op.or]: stateArr, //["결제완료","결제실패","결제취소"]
                    },
                },
            });
            return res.status(200).send({ data: result, message: "검색 완료" });
        }
    },
};
