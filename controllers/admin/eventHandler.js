const { Request, Response } = require("express");
const user = require("../../models/index.js").user;
const event = require("../../models/index.js").event;

module.exports = {
    uploadAndEdit: async (req, res) => {
        const { img, bannerImg, title, content } = req.body;
        if (
            img === null ||
            bannerImg === null ||
            title === null ||
            content === null
        ) {
            return res
                .status(500)
                .send({ data: null, message: "누락된 항목이 있습니다." });
        }
        const newEvent = await event.create({
            title: title,
            content: content,
            userId: userId,
        });
        res.status(200).send({ data: null, message: "등록 완료" });
        //사용자가 아닐때 상태 값 추가
    },
    delete: async (req, res) => {
        const { eventId } = req.body;
        const deletEvent = await event.findOne({ where: { id: eventId } });
        deletEvent.distory();
        res.status(200).send({
            data: null,
            message: "성공적으로 삭제 하였습니다.",
        });
    },
};
