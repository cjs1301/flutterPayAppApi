const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const transaction = require("../../models/index.js").transaction;
const store = require("../../models/index.js").store;
const alarm = require("../../models/index.js").alarm;
const pushEvent = require("../../modules/push");
const token = require("../../modules/token");
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
                        `${process.env.PY_API}/app/gpointcoupon?userId=${User.id}`
                    );

                    //쿠폰 사용가능 목록 배열처리
                    let couponlist = result.data.data.coupon;
                    couponlist.forEach((el) => {
                        el.provider_list = el.provider_list
                            .split("|")
                            .filter((i) => i !== "")
                            .map((el) => Number(el));
                    });
                    result.data.data.coupon = couponlist;
                    res.status(200).send({
                        data: result.data.data,
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
        let userId = await token.check(authorization);
        let User = await user.findOne({ where: { id: userId } });
        if (!User) {
            return res
                .status(403)
                .send({ data: null, message: "유저정보 없음" });
        }
        //결제 금액, 사용할 포인트, 사용할 쿠폰, 사용될 가게, 금액
        const { useGpoint, couponData, storeId, price } = req.body;

        let findStore = await store.findOne({
            where: { isShow: true, id: storeId },
        });
        if (!findStore) {
            return res
                .status(400)
                .send({ data: null, message: "없는 가게입니다" });
        }
        let newTransaction = await transaction.create({
            userId: User.id,
            storeId: storeId,
            price: price,
            useGpoint: useGpoint,
            minus: true,
        });
        let couponPrice;
        let resultPrice = price - useGpoint;

        //쿠폰 사용시
        if (couponData) {
            function couponCheck(data, price) {
                //쿠폰 사용확인리스트
                //1 사용가능한 최소 상품의 가격 체크
                //2 할인 최대금액 초과 여부 체크
                //3 사용가능한 스토어여부 체크
                let result = {
                    price: null,
                    message: null,
                };
                let salePrice;
                if (data.limit_price > price) {
                    result.price = false;
                    result.message = "최소 사용 상품가격보다 낮음";
                    return result; //최소 사용 상품가격보다 낮음
                }

                if (data.sale_type === "percent") {
                    salePrice = Math.floor(
                        (price * (100 - data.percent_goods)) / 100
                    );
                    if (price - salePrice > data.max_percent_goods) {
                        result.price = false;
                        result.message = "최대 할인 금액 보다 높음";
                        return result; //최대 할인 금액 보다 높음
                    }
                }
                if (data.provider_list.length >= 1) {
                    if (!data.provider_list.includes(storeId)) {
                        result.price = false;
                        result.message = "사용할수있는 가게가 아님";
                        return result; //사용할수있는 가게가 아님
                    }
                }
                switch (data.sale_type) {
                    case "percent":
                        result.price = Math.floor(
                            (price * (100 - data.percent_goods)) / 100
                        );
                        result.message = "%할인 쿠폰 적용가";
                        return result;
                        break;

                    case "won":
                        result.price = price - data.won_goods;
                        result.message = "원할인 쿠폰 적용가";
                        return result;
                        break;

                    default:
                        result.price = false;
                        return result;
                        break;
                }
            }
            couponPrice = couponCheck(couponData, price);
            newTransaction.gMoney = couponPrice.price - useGpoint;
            newTransaction.couponData = couponData.coupon_code;
            if (!couponPrice.price) {
                newTransaction.state = "결제실패";
                newTransaction.save();
                return res.status(400).send({
                    data: null,
                    message: couponPrice.message,
                });
            }
            resultPrice = couponPrice.price - useGpoint;
        }

        if (User.gMoney - resultPrice < 0) {
            newTransaction.gMoney = resultPrice;
            newTransaction.state = "결제실패";
            newTransaction.save();
            return res.status(400).send({
                data: null,
                message: "회원의 잔액이 결제금액보다 부족합니다",
            });
        }

        //기존 데이터베이스에 포인트, 쿠폰 사용가능 확인 api 요청
        newTransaction.gMoney = resultPrice;
        newTransaction.couponData = couponData ? couponData.coupon_code : "";
        let data = new FormData();
        data.append("userId", User.id);
        data.append("gPoint", useGpoint);
        couponData
            ? data.append("couponCode", couponData.coupon_code)
            : data.append("couponCode", "");
        data.append("orderNo", newTransaction.id);
        data.append("payMoney", price);
        data.append("storeId", storeId);

        let config = {
            method: "post",
            url: `${process.env.PY_API}/app/buy`,
            headers: {
                ...data.getHeaders(),
            },
            data: data,
        };
        try {
            let result = await axios(config);
            let resultData = result.data.data;

            if (resultData.result === "success") {
                User.gMoney = User.gMoney - resultPrice;
                User.save();
                newTransaction.state = "결제완료";
                newTransaction.save();
                let contents = {
                    title: "결제완료 안내",
                    body:
                        findStore.name +
                        "에서\n" +
                        resultPrice +
                        "광이 결제 되었습니다.\n" +
                        "결제시 이용하신 포인트나 쿠폰정보는 \n" +
                        "내 정보 보기를 이용해주세요",
                };
                await alarm.create({
                    userId: User.id,
                    title: contents.title,
                    content: contents.body,
                });
                pushEvent.noti(contents, User.fcmToken);
                pushEvent.data("/user/info", User.fcmToken);
                return res.status(200).send({
                    data: User.gMoney,
                    message: "결제가 성공하였습니다",
                });
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
    },
};
