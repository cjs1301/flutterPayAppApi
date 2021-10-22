const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const transaction = require("../../models/index.js").transaction;
const store = require("../../models/index.js").store;
const type = require("../../models/index.js").type;
const bcrypt = require("bcrypt");
const pushEvent = require("../push");
const token = require("../token/accessToken");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

module.exports = {
    check: async (req, res) => {
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
                    //결제 정보 포인트 쿠폰 잔액 정보 확인
                    let result = await axios.get(
                        `${process.env.TEST_API}/app/gpointcoupon?userId=${User.userCode}`
                    );
                    res.status(200).send({
                        data: result.data,
                        message: "유저정보 확인",
                    });
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
                data: userInfo,
                message: "포인트 쿠폰 체크중 에러발생",
            });
        }
    },
    buy: async (req, res) => {
        //유저 정보 확인
        const authorization = req.headers.authorization;
        let userId = token.check(authorization);
        let User = await user.findOne({ where: { id: userId } });
        if (!User) {
            return res
                .status(403)
                .send({ data: null, message: "유저정보 없음" });
        }
        //결제 금액, 사용할 포인트, 사용할 쿠폰, 사용될 가게, 금액
        const { useGpoint, couponData, storeId, price } = req.body;
        //let resultPrice= price * couponData - usegPoint

        let newTransaction;

        let resultPrice = price - useGpoint;

        if (User.gMoney - resultPrice < 0) {
            await transaction.create({
                userId: User.id,
                storeId: storeId,
                price: price,
                gMoney: resultPrice,
                state: "결제실패",
            });

            return res.status(400).send({
                data: null,
                message: "회원의 잔액이 결제금액보다 부족합니다",
            });
        }
        //포인트나 쿠폰 사용시
        if (useGpoint !== "" || useCoupon !== "") {
            //기존 데이터베이스에 포인트, 쿠폰 사용가능 확인 api 요청
            newTransaction = await transaction.create({
                userId: User.id,
                transactionTypeId: Type.id,
                storeId: storeId,
                price: price,
                gMoney: resultPrice,
                useGpoint: useGpoint,
                couponData: couponData,
            });
            let data = new FormData();
            data.append("userId", User.userCode);
            data.append("gPoint", useGpoint);
            data.append("couponCode", "");
            data.append("orderNo", newTransaction.id);
            data.append("payMoney", price);
            data.append("storeId", storeId);

            let config = {
                method: "post",
                url: `${process.env.TEST_API}/app/buy`,
                headers: {
                    ...data.getHeaders(),
                },
                data: data,
            };
            try {
                let result = await axios(config);
                let resultData = result.data.data;
                if (resultData.result === "success") {
                    User.gPoint = resultData.gPoint;
                    User.save();
                    newTransaction.state = "결제성공";
                    newTransaction.save();
                    pushEvent.data("/user/info", User.fcmToken);
                    return res
                        .status(200)
                        .send({ data: null, message: "결제가 성공하였습니다" });
                }
            } catch (error) {
                console.log(error);
                newTransaction.state = "결제실패";
                newTransaction.save();
                return res.status(400).send({
                    data: null,
                    message: "회원의 쿠폰이나 포인트 정보가 맞지 않습니다",
                });
            }
        }
    },
};
