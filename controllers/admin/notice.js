const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const notice = require("../../models/index.js").notice;

module.exports = {
    uploadAndEdit: async (req, res) => {
        const { title, content } = req.body;

        const newNotice = await notice.create({
            title: title,
            content: content,
        });
        res.status(200).send({ data: null, message: "등록 완료" });
    },
    delete: async (req, res) => {
        const { noticeId } = req.body;
        const deletNotice = await notice.findOne({ where: { id: noticeId } });
        deletNotice.distory();
        res.status(200).send({
            data: null,
            message: "성공적으로 삭제 하였습니다.",
        });
    },
};
