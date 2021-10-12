const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const event = require("../../models/index.js").event;

module.exports = {
    uploadAndEdit: async (req, res) => {
        const { img, bannerImg, title, content } = req.body;
        if (
            img === null ||
            bannerImg === null ||
            title === null ||
            content === null
        ) {
            return res
                .status(500)
                .send({ data: null, message: "누락된 항목이 있습니다." });
        }
        const newEvent = await event.create({
            title: title,
            content: content,
            userId: userId,
        });
        res.status(200).send({ data: null, message: "등록 완료" });
        //사용자가 아닐때 상태 값 추가
    },
    delete: async (req, res) => {
        const { eventId } = req.body;
        const deletEvent = await event.findOne({ where: { id: eventId } });
        deletEvent.distory();
        res.status(200).send({
            data: null,
            message: "성공적으로 삭제 하였습니다.",
        });
    },
    search: async (req, res) => {
        let admin;
        //관리자 확인
        const { name, dateType, date, state } = req.query;
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
