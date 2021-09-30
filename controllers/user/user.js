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
    mouthTransaction: async (req, res) => {
        //유저 정보 확인
        let userCode;
        let User = await user.findOne({ where: { userCode: userCode } });
        if (!User) {
            return; //유저정보없음
        }
        const { resultType, mouth } = req.body;
        switch (resultType) {
            case "전체":
                let transactionData = await transaction.findAll({
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
                let transactionData = await transaction.findAll({
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
                let transactionData = await transaction.findAll({
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
    uploadPassword: async (req, res) => {},
    editPassword: async (req, res) => {},
    uploadActivityArea: async (req, res) => {},
    editActivityArea: async (req, res) => {},
    uploadBelongGroup: async (req, res) => {},
    editBelongGroup: async (req, res) => {},
    logout: async (req, res) => {},
};
