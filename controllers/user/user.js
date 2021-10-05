const { Request, Response } = require("express");
const bcrypt = require("bcrypt");
const user = require("../../models/index.js").user;
const transaction = require("../../models/index.js").transaction;
const type = require("../../models/index.js").type;
const store = require("../../models/index.js").store;
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");

module.exports = {
    info: async (req, res) => {
        //유저 정보 확인
        //실패

        //성공
        //res.status(200).send({data:null,message:""})
        res.status(200).send({ data: userInfo, message: "유저정보 확인" });
    },
    monthTransaction: async (req, res) => {
        //유저 정보 확인
        let userCode;
        let User = await user.findOne({ where: { userCode: userCode } });
        if (!User) {
            return; //유저정보없음
        }
        const { resultType, mouth } = req.body;
        let transactionData;
        switch (resultType) {
            case "전체":
                transactionData = await transaction.findAll({
                    where: {
                        userId: User.id,
                        createdAt: {
                            //[Op.]
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
                    where: { userId: User.id },
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
                    where: { userId: User.id },
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
    uploadPassword: async (req, res) => {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const User = await user.findOne({
            where: { id: userId },
        });
        if (User) {
            User.password = hashedPassword;
            User.save();
            res.status(200).send({ data: null, message: "등록 완료" });
        } else {
            res.status(403).send({
                data: null,
                message: "유저 정보를 확인할수 없습니다.",
            });
        }
    },
    editPassword: async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const checkId = await user.findOne({ where: { id: userId } });

        const checkPassword = false;
        checkPassword = await bcrypt.compare(checkId.password, oldPassword);

        if (checkPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            checkId.password = hashedPassword;
            checkId.save();

            return res.send({ data: null, message: "ok" });
        } else {
            return res.send({
                data: null,
                message: "비밀번호가 일치하지 않습니다.",
            });
        }
    },
    uploadAndEditInfo: async (req, res) => {
        const { activityArea, belongGroup } = req.body;
        const User = await user.findOne({ where: { id: userId } });
        if (User) {
            User.activityArea = activityArea;
            User.belongGroup = belongGroup;
            User.save();
            res.status(200).send({ data: null, message: "등록 완료" });
        } else {
            res.status(403).send({
                data: null,
                message: "확인되지 않는 회원입니다.",
            });
        }
    },
    logout: async (req, res) => {},
};
