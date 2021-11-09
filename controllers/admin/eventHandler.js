const { Request, Response } = require("express");
const { Op } = require("sequelize");
const event = require("../../models/index.js").event;
const {
    start,
    end,
    created,
    startAll,
    endAll,
    createdAll,
} = require("./eventFn");

module.exports = {
    uploadAndEdit: async (req, res) => {
        let today = new Date();
        let state;
        const { title, content, startDate, endDate, isShow, id } = req.body;

        const { img, bannerImg } = req.files;

        console.log(req.body);
        console.log(req.files);
        if (!title || !content || !startDate || !endDate) {
            return res
                .status(500)
                .send({ data: null, message: "누락된 항목이 있습니다." });
        }

        if (today < new Date(startDate)) {
            state = "시작전";
        }
        if (new Date(startDate) <= today && today <= new Date(endDate)) {
            state = "진행중";
        }
        if (new Date(endDate) < today) {
            state = "종료";
        }

        if (id) {
            let findEvent = await event.findOne({
                where: { id: id },
            });
            if (findEvent) {
                findEvent.img = img[0].path;
                findEvent.bannerImg = bannerImg[0].path;
                findEvent.scontenttate = content;
                findEvent.title = title;
                findEvent.isShow = isShow;
                findEvent.startDate = new Date(startDate);
                findEvent.endDate = new Date(endDate);
                findEvent.state = state;
                findEvent.save();
            }
            return res.status(400).send({
                data: null,
                message: "해당글은 없는 글입니다.",
            });
        }

        if (img[0] && bannerImg[0]) {
            await event.create({
                img: img[0].path,
                bannerImg: bannerImg[0].path,
                content: content,
                title: title,
                isShow: isShow,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                state: state,
            });

            return res.status(200).send({
                data: null,
                message: "작성 완료",
            });
        }

        return res
            .status(500)
            .send({ data: null, message: "누락된 항목이 있습니다." });
    },
    delete: async (req, res) => {
        const { id } = req.body;
        const deletEvent = await event.findOne({ where: { id: id } });
        deletEvent.isShow = false;
        await deletEvent.save();
        res.status(200).send({
            data: null,
            message: "성공적으로 삭제 하였습니다.",
        });
    },
    search: async (req, res) => {
        try {
            //관리자 확인
            const authorization = req.headers.authorization;
            let admin = 1;
            const { word, date, state, limit, pageNum, registration } =
                req.query;
            let offset = 0;

            if (pageNum > 1) {
                offset = limit * (pageNum - 1);
            }
            if (
                word === undefined ||
                date === undefined ||
                state === undefined
            ) {
                res.status(400).send({
                    data: null,
                    message: "쿼리항목이 빠져 있습니다",
                });
            }

            let result;
            if (!state) {
                return res
                    .status(400)
                    .send({ data: null, message: "상태를 입력해주세요" });
            } else if (state !== "전체") {
                switch (registration) {
                    case "시작일":
                        start(word, date, state, limit, offset, result, res);
                        break;

                    case "종료일":
                        end(word, date, state, limit, offset, result, res);
                        break;

                    case "등록일":
                        created(word, date, state, limit, offset, result, res);
                        break;

                    default:
                        created(word, date, state, limit, offset, result, res);
                        break;
                }
            } else {
                switch (registration) {
                    case "시작일":
                        startAll(word, date, limit, offset, result, res);
                        break;

                    case "종료일":
                        endAll(word, date, limit, offset, result, res);
                        break;

                    case "등록일":
                        createdAll(word, date, limit, offset, result, res);
                        break;

                    default:
                        createdAll(word, date, limit, offset, result, res);
                        break;
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};
