const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const charge = require("../../models/index.js").charge;
const subscription = require("../../models/index.js").subscription;
const transaction = require("../../models/index.js").transaction;
const alarm = require("../../models/index.js").alarm;
const axios = require("axios");
const token = require("../token/accessToken");
const pushEvent = require("../push");
const FormData = require("form-data");
const moment = require("moment");
const { QueryTypes } = require("sequelize");
const db = require("../../models/index.js");
require("dotenv").config();

module.exports = {
    send: async (req, res) => {
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);
        const { sendGmoney, toUserId } = req.body;
        //유저 정보 확인
        let fromUser = await user.findOne({ where: { id: userId } });
        if (!fromUser) {
            return res
                .status(403)
                .send({ data: null, message: "회원정보를 확인할수 없습니다" });
        }
        //대상자 확인
        let toUser = await user.findOne({
            where: { id: toUserId },
        });
        if (!toUser) {
            return res
                .status(403)
                .send({ data: null, message: "대상자를 찾을수 없습니다" });
        }
        //사용자 잔액포인트 확인
        if (fromUser.gMoney - sendGmoney >= 0) {
            //사용자 포인트 차감, 대상자 포인트 추가
            fromUser.gMoney = fromUser.gMoney - sendGmoney;
            fromUser.save();
            pushEvent.data("/user/info", fromUser.fcmToken);
            toUser.gMoney = toUser.gMoney + sendGmoney;
            toUser.save();
            let message = {
                title: "입금 알림",
                body: `${fromUser.userName}님이 ${sendGmoney}광을 송금하셨습니다.`,
            };
            pushEvent.data("/user/info", toUser.fcmToken);
            pushEvent.noti(message, toUser.fcmToken);
            await alarm.create({
                userId: toUser.id,
                title: message.title,
                content: message.body,
            });
            await transaction.create({
                userId: fromUser.id,
                actionUserName: toUser.userName,
                gMoney: sendGmoney,
                minus: true,
                state: "송금",
            });
            await transaction.create({
                userId: toUser.id,
                actionUserName: fromUser.userName,
                gMoney: sendGmoney,
                minus: false,
                state: "입금",
            });

            return res.status(200).send({
                data: fromUser.gMoney,
                message: "송금 완료하였습니다.",
            });
        } else {
            return res
                .status(400)
                .send({ data: null, message: "잔액이 부족합니다." });
        }
    },
    sendUserSearch: async (req, res) => {
        try {
            const { word } = req.query;
            console.log(typeof word);
            const list = await user.sequelize.query(
                `SELECT id, userName, idValue FROM users WHERE userName LIKE '${word}%'`,
                { type: QueryTypes.SELECT }
            );
            res.send({ data: list, message: "검색성공" });
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    charge: async (req, res) => {
        //유저 정보 확인
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);

        let User = await user.findOne({ where: { id: userId } });
        if (!User) {
            return res
                .status(403)
                .send({ data: null, message: "회원정보를 확인할수 없습니다" });
        }
        //금액
        const { chargegMoney, name } = req.body;
        console.log(typeof chargegMoney, chargegMoney, typeof name, name);
        if (!chargegMoney || !name) {
            return res.status(400).send({
                data: null,
                message: "내용을 입력하여 주세요",
            });
        }

        //관리앱 충전신청일자, 이름, 신청금액, 은행-계좌번호, 전화번호, 이메일, 충전상태
        let newCharge = await charge.create({
            userId: User.id,
            userName: name,
            money: chargegMoney,
            phoneNumber: User.phoneNumber,
            email: User.email,
            state: "충전신청",
        });

        await db.sequelize.query(
            `CREATE EVENT chargeEvent${newCharge.id}` +
                " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 MINUTE" +
                " DO" +
                ` UPDATE charges SET state = '입금미완료' WHERE id = ${newCharge.id} AND state = '충전신청'`
        );
        //결과 데이터 은행, 계좌번호, 입금 기간 보내기
        let result = {
            충전금액: chargegMoney,
            은행: "우리은행",
            계좌번호: "1005-403-396411",
            입금기간:
                moment().add(30, "m").format("YYYY-MM-DD HH:mm:ss") + " 까지",
        };
        let contents = {
            title: "충전신청완료 알림",
            body:
                "충전금액: " +
                chargegMoney +
                "\n" +
                "은행: 우리은행\n" +
                "계좌번호: 1005-403-396411\n" +
                "입금기간: " +
                moment().add(30, "m").format("YYYY-MM-DD HH:mm:ss") +
                " 까지",
        };
        await alarm.create({
            userId: User.id,
            title: contents.title,
            content: contents.body,
        });
        pushEvent.data("/user/info", User.fcmToken);
        pushEvent.noti(contents, User.fcmToken);
        return res.status(200).send({
            data: result,
            message: "신청이 접수되었습니다.",
        });
    },
    coupon: async (req, res) => {
        //내쿠폰정보 확인
        //사용자 정보 받기
        //유저 정보 확인
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);
        if (!userId) {
            //실패
            return res
                .status(403)
                .send({ data: null, message: "만료된 토큰입니다" });
        } else {
            //성공
            try {
                let userCoupon = await axios.get(
                    `${process.env.TEST_API}/app/coupon?userId=${userId}`
                );

                return res.status(200).send({
                    data: userCoupon.data,
                    message: userCoupon.data.message,
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    data: null,
                    message: error.response.data.message,
                });
            }
        }
    },
    getCoupon: async (req, res) => {
        //내쿠폰정보 확인
        //사용자 정보 받기
        //유저 정보 확인
        try {
            const authorization = req.headers.authorization;
            let userId = await token.check(authorization);
            if (!userId) {
                //실패
                return res
                    .status(403)
                    .send({ data: null, message: "만료된 토큰입니다" });
            } else {
                //성공
                try {
                    const { code } = req.body;
                    let data = new FormData();
                    data.append("code", code);
                    data.append("userId", userId);

                    let config = {
                        method: "post",
                        url: `${process.env.TEST_API}/app/coupon`,
                        headers: {
                            ...data.getHeaders(),
                        },
                        data: data,
                    };

                    let result = await axios(config);

                    return res.status(200).send(result.data);
                } catch (error) {
                    console.log(error);
                    return res.status(500).send({
                        data: null,
                        message: error.response.data.message,
                    });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                data: null,
                message: "쿠폰발급중 에러가 발생했습니다.",
            });
        }
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

    subscriptionDownload: async (req, res) => {
        //약정충전 신청서 다운로드
        var path = require("path");
        console.log(req.params);
        console.log(__dirname);
        var file = path.join(__dirname, "../../" + req.params.name);
        res.download(file, function (err) {
            if (err) {
                console.log("Error");
                console.log(err);
            } else {
                console.log("Success");
            }
        });
    },
    subscriptionUpload: async (req, res) => {
        //약정충전 신청서 업로드
        //유저 정보 확인
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);
        const file = req.file;
        let User = await user.findOne({ where: { id: userId } });
        if (!User) {
            return res
                .status(403)
                .send({ data: null, message: "회원정보를 확인할수 없습니다" });
        }

        //관리앱 충전신청일자, 이름, 신청금액, 은행-계좌번호, 전화번호, 이메일, 충전상태
        await subscription.create({
            userId: User.id,
            userName: User.userName,
            phoneNumber: User.phoneNumber,
            email: User.email,
            state: "신청대기",
            file: file.path,
        });

        res.status(200).send({
            data: null,
            message: "신청이 접수되었습니다.",
        });
    },
    mySubscription: async (req, res) => {
        //내 약정충전 신청 상태 확인
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);
        let User = await user.findOne({ where: { id: userId } });
        if (!User) {
            return res
                .status(403)
                .send({ data: null, message: "회원정보를 확인할수 없습니다" });
        }

        let find = await subscription.findOne({
            where: {
                userId: userId,
            },
        });
        if (find) {
            return res.status(200).send({
                data: find,
                message: "완료",
            });
        }
        return res
            .status(500)
            .send({ data: null, message: "신청하신 약정결제내역이 없습니다." });
    },
    deleteSubscription: async (req, res) => {
        //약청충전 해지 신청

        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);
        let User = await user.findOne({ where: { id: userId } });
        if (!User) {
            return res
                .status(403)
                .send({ data: null, message: "회원정보를 확인할수 없습니다" });
        }

        let find = await subscription.findOne({
            where: {
                userId: userId,
            },
        });
        if (find) {
            find.state = "해지신청";
            find.save();
            return res.status(200).send({
                data: null,
                message: "완료",
            });
        }
        return res
            .status(500)
            .send({ data: null, message: "신청하신 약정결제내역이 없습니다." });
    },
    point: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            let userId = await token.check(authorization);
            if (!userId) {
                //실패
                return res
                    .status(403)
                    .send({ data: null, message: "만료된 토큰입니다" });
            } else {
                //성공
                try {
                    const User = await user.findOne({
                        where: { id: userId },
                    });
                    if (!User) {
                        return res.status(403).send({
                            data: null,
                            message: "일치하는 회원정보를 찾지 못했습니다",
                        });
                    }
                    const { month, year } = req.query;

                    let config = {
                        method: "get",
                        url:
                            process.env.TEST_API +
                            `/app/gpoint?userId=${User.id}&year=${year}&month=${month}`,
                        headers: {},
                    };
                    try {
                        let result = await axios(config);
                        res.status(200).send({
                            data: result.data.data,
                            message: result.message,
                        });
                    } catch (error) {
                        res.status(400).send({
                            data: null,
                            message: result.message,
                        });
                    }
                } catch (error) {
                    console.log(error);
                    return res.status(403).send({
                        data: null,
                        message: "일치하는 회원정보를 찾지 못했습니다",
                    });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                data: null,
                message: "쿠폰발급중 에러가 발생했습니다.",
            });
        }
    },
};
