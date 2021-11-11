const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const question = require("../../models/index.js").question;
const charge = require("../../models/index.js").charge;
const subscription = require("../../models/index.js").subscription;
const event = require("../../models/index.js").event;
const store = require("../../models/index.js").store;
const transaction = require("../../models/index.js").transaction;
const storeQuestion = require("../../models/index.js").storeQuestion;
const token = require("../token/accessToken");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
    homeInfo: async (req, res) => {
        //운영자 계정 확인
        const authorization = req.headers.authorization;
        console.log(authorization);
        let adminId = 1;
        //정보 리스트
        let result = {
            today: {
                //데이터 최신화 시간, 매출, 결제완료, 결제취소, 결제실패
                now: moment().format(`MM월 DD일 HH:mm`),
                sales: 0,
                chargeList: 0,
                subscriptionList: 0,
                questionList: 0,
            },
            recentchargeList: {
                // 최근 결제내역 거래일자, 이름, 결제금액, 결제취소를 위한 정보
            },
            recentEvent: {}, //최근 운영공지 제목, 날짜 (시간제외)
            newQuestion: {
                user: 0,
                store: 0,
            }, //운영문의
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
                state: "결제완료",
                createdAt: {
                    [Op.between]: [startDay, endDay],
                },
            },
        });

        result.today.chargeList = await charge.count({
            where: {
                state: "충전신청",
                createdAt: {
                    [Op.between]: [startDay, endDay],
                },
            },
        });
        result.today.subscriptionList = await subscription.count({
            where: {
                state: "신청대기",
                createdAt: {
                    [Op.between]: [startDay, endDay],
                },
            },
        });
        let userQ, storeQ;
        const qasyncA = async () => {
            userQ = await question.count({
                where: {
                    isAnswer: false,
                    createdAt: {
                        [Op.between]: [startDay, endDay],
                    },
                },
            });
        };

        const qasyncB = async () => {
            storeQ = await storeQuestion.count({
                where: {
                    isAnswer: false,
                    createdAt: {
                        [Op.between]: [startDay, endDay],
                    },
                },
            });
        };
        const qlist = [qasyncA, qasyncB];
        await Promise.all(qlist.map((fn) => fn()));
        result.today.questionList = userQ;
        result.recentchargeList = await charge.findAll({
            order: [["updatedAt", "DESC"]],
            limit: 5,
            include: [
                {
                    model: user,
                    attributes: ["userName"],
                },
            ],
        });
        result.recentEvent = await event.findAll({
            order: [["updatedAt", "DESC"]],
            limit: 4,
        });

        result.newQuestion.user = userQ;
        result.newQuestion.store = storeQ;

        res.status(200).send({ data: result, message: "완료" });
    },
};
