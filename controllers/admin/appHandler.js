const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const answer = require("../../models/index.js").answer;

module.exports = {
    uploadAndEdit: async (req, res) => {
        const { title, content, askId } = req.body;

        const newAnswer = await answer.create({
            title: title,
            content: content,
            askId: askId,
        });
        res.status(200).send({ data: null, message: "등록 완료" });
    },
};
