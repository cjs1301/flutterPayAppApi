const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const ask = require("../../models/index.js").ask;

module.exports = {
    uploadAndEdit: async (req, res) => {
        const { title, content } = req.body;

        const newAsk = await ask.create({
            title: title,
            content: content,
            userId: userId,
        });
        res.status(200).send({ data: null, message: "등록 완료" });
    },
};
