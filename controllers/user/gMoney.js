const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const charge = require("../../models/index.js").charge;
const subscription = require("../../models/index.js").subscription;
const axios = require("axios");
const token = require("../token/accessToken");
const pushEvent = require("../push");
const FormData = require("form-data");
const moment = require("moment");
const { QueryTypes } = require("sequelize");
const db = require("../../models/index.js");
require("dotenv").config();

//pushEvent("/user/info", userInfo.fcmToken);
module.exports = {
    send: async (req, res) => {
        const authorization = req.headers.authorization;
        let userId = token.check(authorization);
        const { sendGmoney, toUserName, toUserPhoneNumber } = req.body;
        //유저 정보 확인
        let fromUser = await user.findOne({ where: { id: userId } });
        if (!fromUser) {
            return res
                .status(403)
                .send({ data: null, message: "회원정보를 확인할수 없습니다" });
        }
        //대상자 확인
        let toUser = await user.findOne({
            where: { userName: toUserName, phoneNumber: toUserPhoneNumber },
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
            pushEvent.data("/user/info", toUser.fcmToken);
            return res
                .status(200)
                .send({ data: null, message: "송금 완료하였습니다." });
        } else {
            return; //실패
        }
    },
    sendUserSearch: async (req, res) => {
        try {
            const { word } = req.query;
            console.log(typeof word)
            const list = await user.sequelize.query(
                `SELECT userName, email FROM users WHERE userName LIKE '${word}%'`,
                { type: QueryTypes.SELECT }
            );
            res.send({ data:list,message:"검색성공" });
        } catch (error) {
            console.log(error)
            throw error
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
        const { chargegMoney } = req.body;
        if (
            !chargegMoney ||
            chargegMoney === 0 ||
            chargegMoney === null ||
            chargegMoney === ""
        ) {
            res.status(400).send({
                data: null,
                message: "충전금액을 입력하여 주세요",
            });
        }

        //관리앱 충전신청일자, 이름, 신청금액, 은행-계좌번호, 전화번호, 이메일, 충전상태
        let newCharge = await charge.create({
            userId: User.id,
            userName: User.name,
            money: chargegMoney,
            phoneNumber: User.phoneNumber,
            email: User.email,
            state: "충전신청",
        });

        await db.sequelize.query(
            `CREATE EVENT chargeEvent${newCharge.id}` +
                " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 30 MINUTE" +
                " DO" +
                ` UPDATE charges SET state = '입금미완료' WHERE id = ${newCharge.id}`
        );
        //결과 데이터 은행, 계좌번호, 입금 기간 보내기
        let result = {
            충전금액: chargegMoney,
            은행: "어드민 은행",
            계좌번호: "어드민 계좌번호",
            입금기간:
                moment().add(30, "m").format("YYYY-MM-DD HH:mm:ss") + " 까지",
        };
        res.status(200).send({
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
                const User = await user.findOne({
                    where: { id: userId },
                });
                if (!User) {
                    return res.status(403).send({
                        data: null,
                        message: "일치하는 회원정보를 찾지 못했습니다",
                    });
                }
                let userCoupon = await axios.get(
                    `${process.env.TEST_API}/app/coupon?userId=${User.id}`
                );

                res.status(200).send({
                    data: userCoupon.data,
                    message: "쿠폰정보",
                });
            } catch (error) {
                console.log(error);
                return res.status(403).send({
                    data: null,
                    message: "일치하는 회원정보를 찾지 못했습니다",
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
                    const User = await user.findOne({
                        where: { id: userId },
                    });
                    if (!User) {
                        return res.status(403).send({
                            data: null,
                            message: "일치하는 회원정보를 찾지 못했습니다",
                        });
                    }
                    let data = new FormData();
                    data.append("code", "8185641B5E8DBF61");
                    data.append("userId", "1");

                    let config = {
                        method: "post",
                        url: `${process.env.TEST_API}/app/coupon`,
                        headers: {
                            ...data.getHeaders(),
                        },
                        data: data,
                    };

                    let result = await axios(config);

                    res.status(200).send(result);
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
        console.log(__dirname);
        var file = path.join(__dirname, "../pdfs/" + req.params.Name + ".pdf");
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
        console.log(req.file);
        res.send(req.file);
    },
    test: async (req, res) => {
        try {
            let newcharge = await charge.create({
                userId: 2,
                userName: "홍길동",
                money: 1000,
                phoneNumber: "01012345679",
                email: "hi2@gmail.com",
                state: "충전신청",
            });
            //var date2 = Date.now();
            //date2.toLocaleString();
            console.log(moment().format());
            //console.log(date2.toLocaleString(), "now를 사용한 데이트");

            let a = await db.sequelize.query(
                `CREATE EVENT hey${newcharge.id}` +
                    ` ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 20 SECOND` +
                    " DO" +
                    ` UPDATE charges SET state = '입금미완료' WHERE id = ${newcharge.id}`
            );
            console.log(moment().format(), "서버에서 표시할 시간");
            console.log(newcharge.createdAt, "데이터베이스에 저장된 시간");
            res.send("ok");
        } catch (error) {
            console.log(error);
            await newcharge.distory();
            return res.status(400);
        }
    },
    test2: async (req, res) => {
        let ha = await charge.findAll();
        res.send(ha);
    },
};
//` ON SCHEDULE AT CURRENT_TIMESTAMP - INTERVAL 8:55 HOUR_MINUTE`
