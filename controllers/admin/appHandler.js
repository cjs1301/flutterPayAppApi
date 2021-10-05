const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const answer = require("../../models/index.js").answer;

module.exports = {
    uploadAndEdit: async (req, res) => {
        const { title, content, questionId } = req.body;

        const newAnswer = await answer.create({
            title: title,
            content: content,
            questionId: questionId,
        });
        res.status(200).send({ data: null, message: "등록 완료" });
    },
};
