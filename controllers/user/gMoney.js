const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const { QueryTypes } = require("sequelize");

module.exports = {
    send: async (req, res) => {
        const { sendGmoney, toUserName, toUserPhoneNumber } = req.body;
        //유저 정보 확인
        let userCode;
        let fromUser = await user.findOne({ where: { userCode: userCode } });
        if (!fromUser) {
            return;
        }
        //대상자 확인
        let toUser = await user.findOne({
            where: { userName: toUserName, phoneNumber: toUserPhoneNumber },
        });
        if (!toUser) {
            return; //대상자를 찾을 수 없습니다
        }
        //사용자 잔액포인트 확인
        if (fromUser.gMoney - sendGmoney >= 0) {
            //사용자 포인트 차감, 대상자 포인트 추가
            fromUser.gMoney = fromUser.gMoney - sendGmoney;
            fromUser.save();
            toUser.gMoney = toUser.gMoney + sendGmoney;
            toUser.save();
            return res
                .status(200)
                .send({ data: null, message: "송금 완료하였습니다." });
        } else {
            return; //실패
        }
    },
    charge: async (req, res) => {
        //유저 정보 확인
        let userCode;
        let User = await user.findOne({ where: { userCode: userCode } });
        if (!User) {
            return; //유저정보없음
        }
        //금액
        const { chargegMoney } = req.body;
        //어드민에게 내역 알리기
        //결과 데이터 은행, 계좌번호, 입금 기간 보내기
    },
    sendUserSearch: async (req, res) => {
        const { word } = req.query;
        const list = await user.sequelize.query(
            `SELECT userName, phoneNumber FROM users WHERE userName LIKE '${word}%'`,
            { type: QueryTypes.SELECT }
        );
        res.send({ list });
    },
};
