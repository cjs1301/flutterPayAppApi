const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const transaction = require("../../models/index.js").transaction;
const store = require("../../models/index.js").store;
const alarm = require("../../models/index.js").alarm;
//const question = require("../../models/index.js").question;
const { Op } = require("sequelize");
const axios = require("axios");
const crypto = require("crypto");
const FormData = require("form-data");
const token = require("../token/accessToken");

const arrByDate = (array) => {
    let day = [array[0]];
    let result = [];
    for (let i = 1; i < array.length; i++) {
        let pre = new Date(array[i - 1].createdAt);
        let crr = new Date(array[i].createdAt);
        if (pre.getDate() === crr.getDate()) {
            day.push(array[i]);
            if (i === array.length - 1) {
                result.push(day);
            }
        } else {
            result.push(day);
            day = [];
            day.push(array[i]);
            if (i === array.length - 1) {
                result.push(day);
            }
        }
    }
    return result;
};

module.exports = {
    info: async (req, res) => {
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
                let nowDate = new Date();
                console.log(
                    nowDate.getFullYear(),
                    nowDate.getMonth(),
                    nowDate.getHours()
                );
                let userGpoint = await axios.get(
                    `${process.env.TEST_API}/app/gpoint?userId=${
                        User.id
                    }&year=${nowDate.getFullYear()}&month=${nowDate.getMonth()}`
                );
                let userCoupon = await axios.get(
                    `${process.env.TEST_API}/app/coupon?userId=${User.id}`
                );

                let userInfo = {
                    ...User.dataValues,
                    gPoint: Math.floor(userGpoint.data.data.emoney),
                };
                userInfo.couponCount = userCoupon.data.data.active.length;
                res.status(200).send({
                    data: userInfo,
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
    },
    monthTransaction: async (req, res) => {
        //월별 사용자 거래 내역
        //유저 정보 확인
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);
        if (!userId) {
            //실패
            return res
                .status(403)
                .send({ data: null, message: "만료된 토큰입니다" });
        }
        const { resulttype, month, year } = req.query;
        console.log(year);
        let from = Number(month) - 1;
        let to = Number(month);
        const startOfMonth = new Date(year, from, 1);
        const endOfMonth = new Date(year, to, 0);
        endOfMonth.setDate(endOfMonth.getDate() + 1);

        let transactionData;

        console.log(resulttype, startOfMonth, endOfMonth);

        switch (resulttype) {
            case "전체":
                transactionData = await transaction.findAll({
                    where: {
                        userId: userId,
                        createdAt: {
                            [Op.between]: [startOfMonth, endOfMonth],
                        },
                        state: {
                            [Op.or]: [
                                "일반충전",
                                "약정충전",
                                "송금",
                                "입금",
                                "결제완료",
                                "결제취소",
                            ],
                        },
                    },
                    include: [
                        {
                            model: store,
                            attributes: ["name"],
                        },
                        {
                            model: user,
                            attributes: ["userName"],
                        },
                    ],
                    order: [["createdAt", "DESC"]],
                });

                return res.status(200).send({
                    data: arrByDate(transactionData),
                    message: "전체 내역 출력",
                });
                break;
            case "충전":
                transactionData = await transaction.findAll({
                    where: {
                        userId: userId,
                        createdAt: {
                            [Op.between]: [startOfMonth, endOfMonth],
                        },
                        state: {
                            [Op.or]: ["일반충전", "약정충전"],
                        },
                    },
                    include: [
                        {
                            model: user,
                            attributes: ["userName"],
                        },
                    ],
                    order: [["createdAt", "DESC"]],
                });
                return res.status(200).send({
                    data: arrByDate(transactionData),
                    message: "일반,약정 충전 내역 출력",
                });
            case "결제":
                transactionData = await transaction.findAll({
                    where: {
                        userId: userId,
                        createdAt: {
                            [Op.between]: [startOfMonth, endOfMonth],
                        },
                        state: {
                            [Op.or]: ["결제완료"],
                        },
                    },
                    include: [
                        {
                            model: store,
                            attributes: ["name"],
                        },
                        {
                            model: user,
                            attributes: ["userName"],
                        },
                    ],
                    order: [["createdAt", "DESC"]],
                });
                return res.status(200).send({
                    data: arrByDate(transactionData),
                    message: "송금,결제 내역 출력",
                });
        }

        return res
            .status(500)
            .send({ data: null, message: "조회할 내역의 타입을 정해주세요" });
    },
    uploadAndEditInfo: async (req, res) => {
        //소속그룹 등록 belongGroup: DataTypes.STRING,
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);
        const { belongGroup, phoneNumber, email } = req.body;
        const User = await user.findOne({ where: { id: userId } });
        if (User) {
            User.belongGroup = belongGroup;
            User.phoneNumber = phoneNumber;
            User.email = email;
            User.save();
            res.status(200).send({ data: null, message: "등록 완료" });
        } else {
            res.status(403).send({
                data: null,
                message: "확인되지 않는 회원입니다.",
            });
        }
    },
    alarm: async (req, res) => {
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);
        const User = await user.findOne({ where: { id: userId } });
        if (User) {
            console.log(User.notiAlarm);
            if (User.notiAlarm) {
                User.notiAlarm = false;
                User.save();
                return res.send({ data: null, message: "알림 끄기" });
            } else {
                User.notiAlarm = true;
                User.save();
                return res.send({ data: null, message: "알림 켜기" });
            }
        }
    },
    alarmList: async (req, res) => {
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);

        let list = await alarm.findAll({
            where: { userId: userId },
        });
        return res.send({ data: list, message: "알림 목록" });
    },
    login: async (req, res) => {
        const { id, password, fcmToken } = req.body;
        if (!id) {
            return res
                .status(400)
                .send({ data: null, message: "아이디를 입력해주세요" });
        }
        if (!password) {
            return res
                .status(400)
                .send({ data: null, message: "비밀번호를 입력해주세요" });
        }
        if (!fcmToken) {
            return res
                .status(400)
                .send({ data: null, message: "기기토큰값이 누락되었습니다" });
        }
        console.log(typeof fcmToken, fcmToken, "fcmToken");
        if (
            typeof id !== "string" ||
            typeof password !== "string" ||
            typeof fcmToken !== "string"
        ) {
            return res
                .status(400)
                .send({ data: null, message: "읽을수없는 타입입니다" });
        }
        //기존서버에 로그인 확인=>사용자 정보 받아오기
        let hash = crypto.createHash("md5").update(password).digest("hex");
        let hashedPassword = crypto
            .createHash("sha256")
            .update(hash)
            .digest("hex");
        let apiResult;
        try {
            let data = new FormData();
            data.append("id", id);
            data.append("password", hashedPassword);
            console.log(id, hashedPassword);
            let config = {
                method: "post",
                url: `${process.env.TEST_API}/app/login`,
                headers: {
                    ...data.getHeaders(),
                },
                data: data,
            };
            apiResult = await axios(config);
        } catch (error) {
            console.log(error);
            console.log(error.response);
            return res
                .status(403)
                .send({ data: null, message: error.response.data.message });
        }
        //페이 데이터베이스에 저장
        const userInfo = apiResult.data.data;
        console.log(userInfo);
        try {
            const [User, created] = await user.findOrCreate({
                where: { id: userInfo.user_id },
                defaults: {
                    id: userInfo.user_id,
                    idValue: id,
                    userName: userInfo.name,
                    email: userInfo.email,
                    phoneNumber: userInfo.callphone,
                    gMoney: 0,
                    couponCount: userInfo.coupon,
                    notiAlarm: true,
                    fcmToken: fcmToken,
                    //todo : rute 추가하기 => 로컬로그인인지 소셜로그인인지 파악
                },
            });
            if (created) {
                let userToken = token.make(User.id);
                return res
                    .status(200)
                    .send({ data: userToken, message: "로그인 성공" });
            } else {
                User.id = userInfo.user_id;
                User.userName = userInfo.name;
                User.email = userInfo.email;
                if (User.phoneNumber !== null) {
                    User.phoneNumber = userInfo.callphone;
                }
                if (User.couponCount !== 0) {
                    User.couponCount = userInfo.coupon;
                }
                User.save();
                let userToken = token.make(User.id);
                res.status(200).send({
                    data: userToken,
                    message: "로그인 성공",
                });
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    snsLoginGetFcmToken: async (req, res) => {
        const authorization = req.headers.authorization;
        let userId = await token.check(authorization);
        const { fcmToken } = req.body;
        if (!userId) {
            //실패
            return res
                .status(403)
                .send({ data: null, message: "만료된 토큰입니다" });
        } else {
            //성공
            try {
                const userInfo = await user.findOne({
                    where: { id: userId },
                });
                if (!userInfo) {
                    return res.status(403).send({
                        data: null,
                        message: "일치하는 회원정보를 찾지 못했습니다",
                    });
                }
                userInfo.fcmToken = fcmToken;
                userInfo.save();
                res.status(200).send({
                    data: null,
                    message: "토큰 저장",
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
};
