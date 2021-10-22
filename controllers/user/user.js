const { Request, Response } = require("express");
const bcrypt = require("bcrypt");
const user = require("../../models/index.js").user;
const transaction = require("../../models/index.js").transaction;
const type = require("../../models/index.js").type;
const store = require("../../models/index.js").store;
const question = require("../../models/index.js").question;
const { Op } = require("sequelize");
const axios = require("axios");
const crypto = require("crypto");
const FormData = require("form-data");
const token = require("../token/accessToken");

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
                let userGpoint = await axios.get(
                    `${process.env.TEST_API}/app/gpoint?userId=${
                        User.userCode
                    }&year=${nowDate.getFullYear()}&month=${nowDate.getMonth()}`
                );

                let userInfo = {
                    ...User.dataValues,
                    gPoint: userGpoint.data.data.emoney,
                };
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
        let userId = token.check(authorization);
        if (!userId) {
            throw Error;
        }
        const { resulttype, month } = req.query;
        let monthFormat = month === null ? moment().format(`MM`) : month;
        let year = moment().format(`YYYY`);
        let startMonth = new Date(`${year}-${monthFormat}-${01}`);
        let endMonth = new Date(`${year}-${monthFormat}-${31}`);
        let transactionData;
        switch (resulttype) {
            case "전체":
                transactionData = await transaction.findAll({
                    where: {
                        userId: userId,
                        createdAt: {
                            [Op.between]: [startMonth, endMonth],
                        },
                    },
                    include: [
                        {
                            model: type,
                            attrebutes: ["type"],
                        },
                        {
                            model: store,
                            attrebutes: ["name"],
                        },
                    ],
                });
                return res
                    .status(200)
                    .send({ data: transactionData, message: "전체 내역 출력" });
                break;
            case "충전":
                transactionData = await transaction.findAll({
                    where: {
                        userId: userId,
                        createdAt: {
                            [Op.between]: [startMonth, endMonth],
                        },
                    },
                    include: [
                        {
                            model: type,
                            where: {
                                type: {
                                    [Op.or]: ["일반충전", "약정충전"],
                                },
                            },
                            attrebutes: ["type"],
                        },
                        {
                            model: store,
                            attrebutes: ["name"],
                        },
                    ],
                });
                return res.status(200).send({
                    data: transactionData,
                    message: "일반,약정 충전 내역 출력",
                });
            case "결제":
                transactionData = await transaction.findAll({
                    where: {
                        userId: userId,
                        createdAt: {
                            [Op.between]: [startMonth, endMonth],
                        },
                    },
                    include: [
                        {
                            model: type,
                            where: {
                                type: {
                                    [Op.or]: ["송금", "결제"],
                                },
                            },
                            attrebutes: ["type"],
                        },
                        {
                            model: store,
                            attrebutes: ["name"],
                        },
                    ],
                });
                return res.status(200).send({
                    data: transactionData,
                    message: "송금,결제 내역 출력",
                });
        }

        return res
            .status(500)
            .send({ data: null, message: "조회할 내역의 타입을 정해주세요" });
    },
    // uploadPassword: async (req, res) => {//결제 비밀번호 등록
    //     const authorization = req.headers.authorization;
    //     let userId = token.check(authorization);
    //     const { password } = req.body;
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const User = await user.findOne({
    //         where: { id: userId },
    //     });
    //     if (User) {
    //         User.password = hashedPassword;
    //         User.save();
    //         res.status(200).send({ data: null, message: "등록 완료" });
    //     } else {
    //         res.status(403).send({
    //             data: null,
    //             message: "유저 정보를 확인할수 없습니다.",
    //         });
    //     }
    // },
    // uploadPassword: async (req, res) => {//결제 비밀번호 등록
    //     const authorization = req.headers.authorization;
    //     let userId = token.check(authorization);
    //     const { password } = req.body;
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const User = await user.findOne({
    //         where: { id: userId },
    //     });
    //     if (User) {
    //         User.password = hashedPassword;
    //         User.save();
    //         res.status(200).send({ data: null, message: "등록 완료" });
    //     } else {
    //         res.status(403).send({
    //             data: null,
    //             message: "유저 정보를 확인할수 없습니다.",
    //         });
    //     }
    // },
    // editPassword: async (req, res) => {
    //     const authorization = req.headers.authorization;
    //     let userId = token.check(authorization);
    //     const { oldPassword, newPassword } = req.body;
    //     const checkId = await user.findOne({ where: { id: userId } });

    //     const checkPassword = false;
    //     checkPassword = await bcrypt.compare(checkId.password, oldPassword);

    //     if (checkPassword) {
    //         const hashedPassword = await bcrypt.hash(newPassword, 10);

    //         checkId.password = hashedPassword;
    //         checkId.save();

    //         return res.send({ data: null, message: "ok" });
    //     } else {
    //         return res.send({
    //             data: null,
    //             message: "비밀번호가 일치하지 않습니다.",
    //         });
    //     }
    // },
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
        let userId = token.check(authorization);
        const User = await user.findOne({ where: { id: userId } });
        if (User.notiAlarm) {
            User.notiAlarm = false;
            User.save();
            return res.send({ data: null, message: "알림 끄기" });
        } else {
            User.notiAlarm = true;
            User.save();
            return res.send({ data: null, message: "알림 켜기" });
        }
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
            return res
                .status(403)
                .send({ data: null, message: "확인되지 않는 회원입니다" });
        }
        //페이 데이터베이스에 저장
        const userInfo = apiResult.data.data;
        try {
            const [User, created] = await user.findOrCreate({
                where: { userCode: userInfo.user_id },
                defaults: {
                    userCode: userInfo.user_id,
                    userName: userInfo.name,
                    email: userInfo.email,
                    phoneNumber: userInfo.callphone,
                    gMoney: 0,
                    couponCount: userInfo.coupon,
                    notiAlram: true,
                    fcmToken: fcmToken,
                    //todo : rute 추가하기 => 로컬로그인인지 소셜로그인인지 파악
                },
            });
            if (created) {
                let userToken = token.make(User.userCode);
                return res
                    .status(200)
                    .send({ data: userToken, message: "로그인 성공" });
            } else {
                User.userCode = userInfo.user_id;
                User.userName = userInfo.name;
                User.email = userInfo.email;
                if (User.phoneNumber !== null) {
                    User.phoneNumber = userInfo.callphone;
                }
                if (User.couponCount !== 0) {
                    User.couponCount = userInfo.coupon;
                }
                User.save();
                let userToken = token.make(User.userCode);
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
