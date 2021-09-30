const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const transaction = require("../../models/index.js").transaction;
const store = require("../../models/index.js").store;
const type = require("../../models/index.js").type;
const bcrypt = require("bcrypt");

module.exports = {
    buy: async (req, res) => {
        //유저 정보 확인
        let userCode;
        let User = await user.findOne({ where: { userCode: userCode } });
        if (!User) {
            return; //유저정보없음
        }
        //결제 금액, 사용할 마일리지, 사용할 쿠폰, 사용될 가게, 금액, 결제 비밀번호
        const { usegPoint, useCoupon, storeName, price, password } = req.body;
        //결제 비밀번호 확인
        checkPassword = await bcrypt.compare(User.password, password);
        if (!checkPassword) {
            return; //결제 비밀번호가 일치 하지 않습니다.
        }
        //마일리지나 쿠폰 사용시
        if (usegPoint !== null || useCoupon !== null) {
            //기존 데이터베이스에 마일리지, 쿠폰 사용가능 확인 api 요청
            //불가능
            //가능
            //쿠폰과 마일리지 사용액 차감
        }
        //가격에서 쿠폰과 마일리지 사용금액 제외
        let resultPrice;
        //result = (price*useCoupon)-usegPoint
        //유저 잔액 차감 가능 확인
        if (User.gMoney - resultPrice >= 0) {
            //가능
            User.gMoney = User.gMoney - resultPrice;
            //결제 성공 거래내역 생성
            let Type = await type.findOne({ where: { type: "결제" } }); //let Type = await type.findOne({where:{id:4}})
            let Store = await store.findOne({ where: { name: storeName } });

            await transaction.create({
                userId: User.id,
                transactionTypeId: Type.id,
                storeId: Store.id,
                price: price,
                usegMoney: resultPrice,
                usegPoint: usegPoint !== null ? usegPoint : null,
                addgPoint: usegPoint === null ? resultPrice * 0.03 : null,
            });
            //마일리지 적립
            //User.gPoint
            User.save();
            return res
                .status(200)
                .send({ data: null, message: "결제가 성공하였습니다" });
        } else {
            //불가능 => 사용한 마일리지와 쿠폰 롤백
            return;
        }
    },
};
