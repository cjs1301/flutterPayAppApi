const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const charge = require("../../models/index.js").charge;
let myRegPkey = "09abc7fc-964e-4445-b488-a4209a39b08f";
const { Op } = require("sequelize");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();
const pushEvent = require("../../controllers/push");

module.exports = {
    rtpay: async (req, res) => {
        const { regPkey, BnakName, ugrd, rtpayData } = req.body;
        if (regPkey !== myRegPkey) {
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
                let chargeData = success.data;
                let RPAY = Number(chargeData.RPAY);
                let findChargeData = await charge.findAll({
                    where: {
                        userName: chargeData.RNAME,
                        money: RPAY,
                        state: "충전신청",
                        createdAt: {
                            [Op.lt]: new Date(),
                            [Op.gt]: new Date(new Date() - 100 * 60 * 30),
                        },
                    },
                });
                if (!findChargeData) {
                    //충전 신청자가 없거나 시간이 지남
                    return res.json({ RCODE: 400, PCHK: "NO" }); //실패
                } else if (findChargeData.length > 1) {
                    let result = findChargeData.every((el) => {
                        if (
                            el.phoneNumber === findChargeData[0].phoneNumber &&
                            el.email === findChargeData[0].email
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (result) {
                        //같은 신청자가 여러번 신청한경우 하나만 통과
                        try {
                            findChargeData[0].dataValues.state = "충전완료";

                            let giveMoneyUser = await user.findOne({
                                where: { id: findChargeData[0].userId },
                            });
                            giveMoneyUser.gMoney = giveMoneyUser.gMoney + RPAY;
                            findChargeData[0].save();
                            giveMoneyUser.save();
                            let contents = {
                                title: "충전완료 알림",
                                body: "신청하신 충전이 완료되었습니다",
                            };
                            pushEvent.noti(contents);
                            return res.json({ RCODE: 200, PCHK: "OK" });
                        } catch (error) {
                            console.log(
                                error,
                                "유저에게 돈을 주는과정에 에러발생"
                            );
                            return res.json({ RCODE: 400, PCHK: "NO" }); //실패
                        }
                    } else {
                        //동명이인 존재
                        //todo 어드민에게 동명입금자 처리 알림코드 작성
                        return res.json({ RCODE: 400, PCHK: "NO" }); //실패
                    }
                } else {
                    try {
                        findChargeData[0].state = "충전완료";

                        let giveMoneyUser = await user.findOne({
                            where: { id: findChargeData[0].userId },
                        });
                        giveMoneyUser.gMoney = giveMoneyUser.gMoney + RPAY;
                        findChargeData[0].save();
                        giveMoneyUser.save();
                        return res.json({ RCODE: 200, PCHK: "OK" });
                    } catch (error) {
                        console.log(error, "유저에게 돈을 주는과정에 에러발생");
                        return res.json({ RCODE: 400, PCHK: "NO" }); //실패
                    }
                }
            }
        } catch (error) {
            return res.json({ RCODE: 400, PCHK: "NO" }); //실패
        }
    },
};
