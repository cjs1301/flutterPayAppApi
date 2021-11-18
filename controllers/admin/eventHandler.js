const { Request, Response } = require("express");
const alarm = require("../../models/index.js").alarm;
const { Op } = require("sequelize");
const pushEvent = require("../../controllers/push");
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

        if (
            !title ||
            !content ||
            !startDate ||
            !endDate ||
            !img ||
            !bannerImg
        ) {
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
                findEvent.content = content;
                findEvent.title = title;
                findEvent.hide = isShow ? false : true;
                findEvent.startDate = new Date(startDate);
                findEvent.endDate = new Date(endDate);
                findEvent.state = state;
                await findEvent.save();
                return res.status(200).send({
                    data: null,
                    message: "수정 완료",
                });
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
                hide: isShow ? false : true,
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
        return res.status(200).send({
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
                return res.status(400).send({
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
                        console.log("시작일", state);
                        start(word, date, state, limit, offset, result, res);
                        break;

                    case "종료일":
                        console.log("종료일", state);
                        end(word, date, state, limit, offset, result, res);
                        break;

                    case "등록일":
                        console.log("등록일", state);
                        created(word, date, state, limit, offset, result, res);
                        break;

                    default:
                        console.log("디폴트", state);
                        created(word, date, state, limit, offset, result, res);
                        break;
                }
            } else {
                switch (registration) {
                    case "시작일":
                        console.log("registration시작일", registration);
                        startAll(word, date, limit, offset, result, res);
                        break;

                    case "종료일":
                        console.log("registration종료일", registration);
                        endAll(word, date, limit, offset, result, res);
                        break;

                    case "등록일":
                        console.log("registration등록일", registration);
                        createdAll(word, date, limit, offset, result, res);
                        break;

                    default:
                        console.log("registration디폴트", registration);
                        createdAll(word, date, limit, offset, result, res);
                        break;
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    copy: async (req, res) => {
        const { id } = req.body;
        const findEvent = await event.findOne({ where: { id: id } });
        await event.create({
            img: findEvent.img,
            bannerImg: findEvent.bannerImg,
            writer: findEvent.writer,
            content: findEvent.content,
            title: findEvent.title,
            hide: findEvent.isShow,
            state: findEvent.state,
            startDate: findEvent.startDate,
            endDate: findEvent.endDate,
        });
        return res.status(200).send({
            data: null,
            message: "복사 하였습니다.",
        });
    },
    event: async (req, res) => {
        const { id } = req.query;
        const findEvent = await event.findOne({ where: { id: id } });
        return res.status(200).send({
            data: findEvent,
            message: "완료",
        });
    },
};
