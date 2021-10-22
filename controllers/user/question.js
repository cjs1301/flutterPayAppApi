const { Request, Response } = require("express");
const question = require("../../models/index.js").question;
const token = require("../token/accessToken");

module.exports = {
    uploadAndEdit: async (req, res) => {
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
                    const { title, content } = req.body;
                    const newQuestion = await question.create({
                        title: title,
                        content: content,
                        userId: userId,
                    });
                    res.status(200).send({ data: null, message: "등록 완료" });
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
                data: null,
                message: "문의글 작성중 오류가 생겼습니다",
            });
        }
    },
    myQuestions: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            console.log(authorization);
            let userId = await token.check(authorization);
            console.log(userId);
            if (!userId) {
                //실패
                return res
                    .status(403)
                    .send({ data: null, message: "만료된 토큰입니다" });
            } else {
                //성공
                try {
                    const myQuestion = await question.findAll({
                        where: { userId: userId },
                    });
                    return res.status(200).send({
                        data: myQuestion,
                        message: "질문리스트",
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
                data: null,
                message: "질문리스트를 받아오는중 에러가 생겼습니다",
            });
        }
    },
};
