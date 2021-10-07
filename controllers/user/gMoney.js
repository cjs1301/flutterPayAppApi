const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const charge = require("../../models/index.js").charge;
const subscription = require("../../models/index.js").subscription;
const axios = require("axios");
var moment = require("moment");
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

        //관리앱 충전신청일자, 이름, 신청금액, 은행-계좌번호, 전화번호, 이메일, 충전상태
        await charge.create({
            userId: User.id,
            userName: User.name,
            money: chargegMoney,
            phoneNumber: User.phoneNumber,
            email: User.email,
            state: "입금미완료",
        });
        //결과 데이터 은행, 계좌번호, 입금 기간 보내기
        let result = {
            충전금액: chargegMoney,
            은행: "어드민 은행",
            계좌번호: "어드민 계좌번호",
            입금기간: moment(),
        };
        res.status(200).send({
            data: result,
            message: "신청이 접수되었습니다.",
        });
    },
    subscriptionUp: async (req, res) => {
        const { name, brithday, bankName, bankNumber, chargegMoney, date } =
            req.body;
        await subscription.create({
            userId: User.id,
            userName: User.name,
            money: chargegMoney,
            bankName: bankName,
            bankNumber: bankNumber,
            phoneNumber: User.phoneNumber,
            birthday: brithday,
            email: User.email,
            withdrawalDate: date,
            state: "약정충전진행",
            TerminationDate: null,
        });
        res.status(200).send({
            data: null,
            message: "약정충전신청 되었습니다",
        });
    },
    subscriptionDown: async (req, res) => {
        await subscription.findOne({
            where: {
                userId: User.id,
            },
        });
        subscription.state = "약정충전해지신청";
        subscription.save();
        res.status(200).send({ data: null, message: "취소신청 되었습니다" });
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
