const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const store = require("../../models/index.js").store;
const storeNotice = require("../../models/index.js").storeNotice;
const transaction = require("../../models/index.js").transaction;
const storeQuestion = require("../../models/index.js").storeQuestion;
const storeAnswer = require("../../models/index.js").storeAnswer;
const token = require("../../modules/token");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
    homeInfo: async (req, res) => {
        //가게운영자 계정 확인
        const authorization = req.headers.authorization;
        let storeId = await token.storeCheck(authorization);
        if (!storeId) {
            return res.status(403).send({
                data: null,
                message: "유효하지 않은 토큰 입니다.",
            });
        }
        //정보 리스트
        let result = {
            today: {
                //데이터 최신화 시간, 매출, 결제완료, 결제취소, 결제실패
                now: moment().format(`MM월 DD일 HH:mm`),
                sales: 0,
                finishedList: 0,
                canceledList: 0,
                failuredList: 0,
            },
            recentPaymentList: {
                // 최근 결제내역 거래일자, 이름, 결제금액, 결제취소를 위한 정보
            },
            recentNotice: {}, //최근 운영공지 제목, 날짜 (시간제외)
            myQuestion: {
                //운영문의
            },
        };
        let startDay = new Date(
            `${moment().format(`YYYY`)}-${moment().format(
                `MM`
            )}-${moment().format(`DD`)} 00:00:00`
        );
        let endDay = new Date(
            `${moment().format(`YYYY`)}-${moment().format(
                `MM`
            )}-${moment().format(`DD`)} 24:00:00`
        );

        result.today.sales = await transaction.sum("price", {
            where: {
                storeId: storeId,
                state: "결제완료",
                updatedAt: {
                    [Op.between]: [startDay, endDay],
                },
            },
        });

        result.today.finishedList = await transaction.count({
            where: {
                storeId: storeId,
                state: "결제완료",
                updatedAt: {
                    [Op.between]: [startDay, endDay],
                },
            },
        });
        result.today.canceledList = await transaction.count({
            where: {
                storeId: storeId,
                state: "결제취소",
                updatedAt: {
                    [Op.between]: [startDay, endDay],
                },
            },
        });
        result.today.failuredList = await transaction.count({
            where: {
                storeId: storeId,
                state: "결제실패",
                updatedAt: {
                    [Op.between]: [startDay, endDay],
                },
            },
        });
        result.recentPaymentList = await transaction.findAll({
            where: {
                storeId: storeId,
            },
            order: [["updatedAt", "DESC"]],
            limit: 5,
            attributes: ["price", "updatedAt", "id", "userId", "state"],
            include: [
                {
                    model: user,
                    attributes: ["userName"],
                },
            ],
        });
        result.recentNotice = await storeNotice.findAll({
            where: { delete: false, hide: false },
            order: [["createdAt", "DESC"]],
            limit: 4,
        });

        result.myQuestion = await storeQuestion.findAll({
            where: {
                delete: false,
                storeId: storeId,
            },
            order: [["createdAt", "DESC"]],
            limit: 2,
            include: [
                {
                    model: store,
                    attributes: ["ceo"],
                },
                {
                    model: storeAnswer,
                },
            ],
        });

        return res.status(200).send({ data: result, message: "완료" });
    },
};
