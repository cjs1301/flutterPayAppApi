const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const charge = require("../../models/index.js").charge;
const alarm = require("../../models/index.js").alarm;
const transaction = require("../../models/index.js").transaction;
const rtpayLog = require("../../models/index.js").rtpayLog;
const { Op } = require("sequelize");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();
const pushEvent = require("../../modules/push");

module.exports = {
    rtpay: async (req, res) => {
        const { regPkey, BnakName, ugrd, rtpayData } = req.body;
        console.log("RTPAY호출");
        if (regPkey !== process.env.RTPAY_KEY) {
            console.log("키값이 일치하지 않아 실패");
            return res.json({ RCODE: 400, PCHK: "NO" }); //실패
        }
        let data = qs.stringify({
            regPkey: regPkey,
            BnakName: BnakName,
            ugrd: ugrd,
            rtpayData: rtpayData,
        });
        let config = {
            method: "post",
            url: "https://rtpay.net/CheckPay/test_checkpay.php",
            headers: {
                Referer: `${process.env.SERVER}/check/rtpay`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
        };
        try {
            let success = await axios(config);
            let log = await rtpayLog.create({
                RCODE: success.data.RCODE,
                RPAY: success.data.RPAY,
                RNAME: success.data.RNAME,
                RTEXT: success.data.RTEXT,
                RBANK: success.data.RBANK,
            });
            if (success.data.RCODE === "200") {
                //응답값이 200 일떄만 들어와야함
                // data: {
                //     RCODE: '200',
                //     RPAY: '1000',
                //     RNAME: '홍길동',
                //     RTEXT: '입출금내역 알림 [입금] 1,000원 홍길동 114-******-04-050 10/10 17:21',
                //     RBANK: '신한은행'
                //   }
                //console.log(success);

                let PayData = success.data;
                let RPAY = Number(PayData.RPAY);
                let chargeList = await charge.findAll({
                    where: {
                        userName: PayData.RNAME,
                        money: RPAY,
                        state: "충전신청",
                    },
                });
                console.log("검색된 충전 리스트", chargeList);
                if (chargeList.length === 0 || !chargeList) {
                    //충전 신청자가 없거나 시간이 지남
                    log.resLog =
                        "충전 신청자가 없거나 시간이 지났거나 신청한금액과 입금한 금액이 다름(여러건 신청후 합산금액 입금 X)";
                    await log.save();
                    //혹은 한사용자가 여러번 신청한후 합산한 금액을 입금
                    return res.json({ RCODE: 200, PCHK: "NO" }); //실패
                } else if (chargeList.length > 1) {
                    //같은 신청자가 여러번 신청한경우
                    let result = chargeList.every((el) => {
                        return el.userId === chargeList[0].userId;
                    });
                    if (result) {
                        //같은 신청자가 여러번 신청한경우 하나만 통과
                        try {
                            chargeList[0].state = "충전완료";

                            let giveMoneyUser = await user.findOne({
                                where: { id: chargeList[0].userId },
                            });
                            if (!giveMoneyUser) {
                                log.resLog = "신청한 유저를 찾을수 없습니다.";
                                await log.save();
                                return res.json({ RCODE: 200, PCHK: "NO" }); //실패
                            }
                            giveMoneyUser.gMoney = giveMoneyUser.gMoney + RPAY;
                            chargeList[0].resultLog = "RTPAY 자동충전 처리";
                            await chargeList[0].save();
                            await giveMoneyUser.save();
                            await transaction.create({
                                userId: giveMoneyUser.id,
                                gMoney: RPAY,
                                state: "일반충전",
                                minus: false,
                            });
                            let contents = {
                                title: "충전완료 알림",
                                body:
                                    "신청하신 " +
                                    RPAY +
                                    "화 충전이 완료되었습니다",
                            };
                            await alarm.create({
                                userId: giveMoneyUser.id,
                                title: "충전완료 알림",
                                content:
                                    "신청하신 " +
                                    RPAY +
                                    "화 충전이 완료되었습니다",
                            });
                            await pushEvent.noti(
                                contents,
                                giveMoneyUser.fcmToken
                            );
                            return res.json({ RCODE: 200, PCHK: "OK" });
                        } catch (error) {
                            console.log(
                                error,
                                "유저에게 돈을 주는과정에 에러발생"
                            );
                            log.resLog =
                                "같은 신청자가 여러번 신청한경우를 처리하던중 오류 발생";
                            await log.save();
                            return res.json({ RCODE: 200, PCHK: "NO" }); //실패
                        }
                    } else {
                        //동명이인인 경우
                        //동명이인 존재하고, 구분이 불가한경우
                        log.resLog =
                            "30분 이내에 동명이인의 신청이 있습니다.(실패)";
                        await log.save();
                        //todo 어드민에게 동명입금자 처리 알림코드 작성
                        return res.json({ RCODE: 200, PCHK: "NO" }); //실패
                    }
                } else {
                    //동명이인이 없을때 단일대상
                    try {
                        chargeList[0].state = "충전완료";

                        let giveMoneyUser = await user.findOne({
                            where: { id: chargeList[0].userId },
                        });
                        giveMoneyUser.gMoney = giveMoneyUser.gMoney + RPAY;
                        chargeList[0].resultLog = "RTPAY 자동충전 처리";
                        await chargeList[0].save();
                        await giveMoneyUser.save();
                        await transaction.create({
                            userId: giveMoneyUser.id,
                            gMoney: RPAY,
                            state: "일반충전",
                            minus: false,
                        });
                        let contents = {
                            title: "충전완료 알림",
                            body:
                                "신청하신 " + RPAY + "화 충전이 완료되었습니다",
                        };
                        await alarm.create({
                            userId: giveMoneyUser.id,
                            title: "충전완료 알림",
                            content:
                                "신청하신 " + RPAY + "화 충전이 완료되었습니다",
                        });
                        await pushEvent.noti(contents, giveMoneyUser.fcmToken);
                        return res.json({ RCODE: 200, PCHK: "OK" });
                    } catch (error) {
                        console.log(error, "유저에게 돈을 주는과정에 에러발생");
                        log.resLog = "충전처리중 오류 발생";
                        await log.save();
                        return res.json({ RCODE: 200, PCHK: "NO" }); //실패
                    }
                }
            } else {
                console.log(success.data);
                return res.json({ RCODE: 300, PCHK: "NO" }); //실패
            }
        } catch (error) {
            console.log(error);
            return res.json({ RCODE: 400, PCHK: "NO" }); //실패
        }
    },
};
