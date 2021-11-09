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
                let ryPayData = success.data;
                let RPAY = Number(ryPayData.RPAY);
                let chargeList;
                let result;
                chargeList = await charge.findAll({
                    where: {
                        userName: ryPayData.RNAME,
                        money: RPAY,
                        state: "충전신청",
                        createdAt: {
                            [Op.lt]: new Date(),
                            [Op.gt]: new Date(new Date() - 100 * 60 * 30),
                        },
                    },
                });

                if (chargeList.length === 0) {
                    //충전 신청자가 없거나 시간이 지남
                    //혹은 한사용자가 여러번 신청한후 합산한 금액을 입금
                    return res.json({ RCODE: 400, PCHK: "NO" }); //실패
                } else if (chargeList.length > 1) {
                    //같은 신청자가 여러번 신청한경우
                    result = chargeList.every((el) => {
                        if (
                            el.phoneNumber === chargeList[0].phoneNumber &&
                            el.email === chargeList[0].email
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (result) {
                        //같은 신청자가 여러번 신청한경우 하나만 통과
                        try {
                            chargeList[0].dataValues.state = "충전완료";

                            let giveMoneyUser = await user.findOne({
                                where: { id: chargeList[0].userId },
                            });

                            giveMoneyUser.gMoney = giveMoneyUser.gMoney + RPAY;
                            chargeList[0].save();
                            giveMoneyUser.save();
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
                            pushEvent.noti(contents, giveMoneyUser.fcmToken);
                            return res.json({ RCODE: 200, PCHK: "OK" });
                        } catch (error) {
                            console.log(
                                error,
                                "유저에게 돈을 주는과정에 에러발생"
                            );
                            return res.json({ RCODE: 400, PCHK: "NO" }); //실패
                        }
                    } else {
                        //동명이인인 경우
                        //동명이인 존재하고, 구분이 불가한경우
                        //todo 어드민에게 동명입금자 처리 알림코드 작성
                        return res.json({ RCODE: 400, PCHK: "NO" }); //실패
                    }
                } else {
                    //동명이인이 없을때 단일대상
                    try {
                        chargeList[0].state = "충전완료";

                        let giveMoneyUser = await user.findOne({
                            where: { id: chargeList[0].userId },
                        });
                        giveMoneyUser.gMoney = giveMoneyUser.gMoney + RPAY;
                        chargeList[0].save();
                        giveMoneyUser.save();
                        await transaction.create({
                            userId: giveMoneyUser.id,
                            gMoney: RPAY,
                            state: "일반충전",
                            minus: false,
                        });
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

// rtpay: async (req, res) => {
//     const { regPkey, BnakName, ugrd, rtpayData } = req.body;
//     if (regPkey !== myRegPkey) {
//         return res.json({ RCODE: 400, PCHK: "NO" }); //실패
//     }
//     let data = qs.stringify({
//         regPkey: regPkey,
//         BnakName: BnakName,
//         ugrd: ugrd,
//         rtpayData: rtpayData,
//     });
//     let config = {
//         method: "post",
//         url: "https://rtpay.net/CheckPay/test_checkpay.php",
//         headers: {
//             Referer: `${process.env.SERVER}/check/rtpay`,
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         data: data,
//     };
//     try {
//         let success = await axios(config);
//         if (success.data.RCODE === "200") {
//             //응답값이 200 일떄만 들어와야함
//             // data: {
//             //     RCODE: '200',
//             //     RPAY: '1000',
//             //     RNAME: '홍길동',
//             //     RTEXT: '입출금내역 알림 [입금] 1,000원 홍길동 114-******-04-050 10/10 17:21',
//             //     RBANK: '신한은행'
//             //   }
//             //console.log(success);
//             let ryPayData = success.data;
//             let RPAY = Number(ryPayData.RPAY);
//             let chargeList;
//             let result;
//             chargeList = await charge.findAll({
//                 where: {
//                     userName: ryPayData.RNAME,
//                     money: RPAY,
//                     state: "충전신청",
//                     createdAt: {
//                         [Op.lt]: new Date(),
//                         [Op.gt]: new Date(new Date() - 100 * 60 * 30),
//                     },
//                 },
//             });

//             if (chargeList.length === 0) {
//                 //충전 신청자가 없거나 시간이 지남
//                 //혹은 한사용자가 여러번 신청한후 합산한 금액을 입금
//                 chargeList = await charge.findAll({
//                     where: {
//                         userName: ryPayData.RNAME,
//                         state: "충전신청",
//                         createdAt: {
//                             [Op.lt]: new Date(),
//                             [Op.gt]: new Date(new Date() - 100 * 60 * 30),
//                         },
//                     },
//                 });
//                 result = chargeList.every((el) => {
//                     if (
//                         el.phoneNumber === chargeList[0].phoneNumber &&
//                         el.email === chargeList[0].email
//                     ) {
//                         return true;
//                     } else {
//                         return false;
//                     }
//                 });
//                 if(result){
//                     let sum = 0
//                 }
//                 return res.json({ RCODE: 400, PCHK: "NO" }); //실패
//             } else if (chargeList.length > 1) {
//                 //같은 신청자가 여러번 신청한경우
//                 result = chargeList.every((el) => {
//                     if (
//                         el.phoneNumber === chargeList[0].phoneNumber &&
//                         el.email === chargeList[0].email
//                     ) {
//                         return true;
//                     } else {
//                         return false;
//                     }
//                 });
//                 if (result) {
//                     //같은 신청자가 여러번 신청한경우 하나만 통과
//                     try {
//                         chargeList[0].dataValues.state = "충전완료";

//                         let giveMoneyUser = await user.findOne({
//                             where: { id: chargeList[0].userId },
//                         });

//                         giveMoneyUser.gMoney = giveMoneyUser.gMoney + RPAY;
//                         chargeList[0].save();
//                         giveMoneyUser.save();
//                         await transaction.create({
//                             userId: giveMoneyUser.id,
//                             gMoney: RPAY,
//                             state: "일반충전",
//                             minus: false,
//                         });
//                         let contents = {
//                             title: "충전완료 알림",
//                             body:
//                                 "신청하신 " +
//                                 RPAY +
//                                 "화 충전이 완료되었습니다",
//                         };
//                         pushEvent.noti(contents, giveMoneyUser.fcmToken);
//                         return res.json({ RCODE: 200, PCHK: "OK" });
//                     } catch (error) {
//                         console.log(
//                             error,
//                             "유저에게 돈을 주는과정에 에러발생"
//                         );
//                         return res.json({ RCODE: 400, PCHK: "NO" }); //실패
//                     }
//                 } else {//동명이인인 경우
//                     //동명이인 존재하고, 구분이 불가한경우
//                     //todo 어드민에게 동명입금자 처리 알림코드 작성
//                     return res.json({ RCODE: 400, PCHK: "NO" }); //실패
//                 }
//             } else {
//                 //동명이인이 없을때 단일대상
//                 try {
//                     chargeList[0].state = "충전완료";

//                     let giveMoneyUser = await user.findOne({
//                         where: { id: chargeList[0].userId },
//                     });
//                     giveMoneyUser.gMoney = giveMoneyUser.gMoney + RPAY;
//                     chargeList[0].save();
//                     giveMoneyUser.save();
//                     await transaction.create({
//                         userId: giveMoneyUser.id,
//                         gMoney: RPAY,
//                         state: "일반충전",
//                         minus: false,
//                     });
//                     return res.json({ RCODE: 200, PCHK: "OK" });
//                 } catch (error) {
//                     console.log(error, "유저에게 돈을 주는과정에 에러발생");
//                     return res.json({ RCODE: 400, PCHK: "NO" }); //실패
//                 }
//             }
//         }
//     } catch (error) {
//         return res.json({ RCODE: 400, PCHK: "NO" }); //실패
//     }
// },
