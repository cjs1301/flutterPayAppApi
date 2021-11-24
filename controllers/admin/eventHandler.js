const { Request, Response } = require("express");
const event = require("../../models/index.js").event;
const token = require("../../modules/token");
const {
    start,
    end,
    created,
    startAll,
    endAll,
    createdAll,
} = require("./eventFn");

let scheduler = async (state, model) => {
    if (state !== "종료") {
        if (state === "진행중") {
            await event.sequelize.query(
                `CREATE EVENT event${model.id}` +
                    ` ON SCHEDULE AT ${model.endDate}` +
                    " DO" +
                    ` UPDATE events SET state = '종료' WHERE id = ${model.id}`
            );
        }
        await event.sequelize.query(
            `CREATE EVENT event${model.id}` +
                ` ON SCHEDULE AT ${model.startDate}` +
                " DO" +
                ` UPDATE events SET state = '진행중' WHERE id = ${model.id}`
        );
    }
};

module.exports = {
    uploadAndEdit: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            let admin = await token.storeCheck(authorization);
            if (!admin) {
                return res.status(403).send({
                    data: null,
                    message: "유효하지 않은 토큰 입니다.",
                });
            }
            let today = new Date();
            let state;
            const { title, content, startDate, endDate, hide, id, writer } =
                req.body;
            console.log(req);
            console.log(req.body);
            const { img, bannerImg } = req.files;
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

            const [find, created] = await event.findOrCreate({
                where: { id: id !== undefined ? id : "" },
                defaults: {
                    img: img !== undefined ? img[0].path : "",
                    bannerImg: bannerImg !== undefined ? bannerImg[0].path : "",
                    content: content,
                    title: title,
                    hide: hide,
                    writer: writer,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    state: state,
                },
            });
            if (!created) {
                if (img !== undefined) {
                    find.img = img[0].path;
                }
                if (bannerImg !== undefined) {
                    find.bannerImg = bannerImg[0].path;
                }
                find.content = content;
                find.title = title;
                find.hide = hide;
                find.writer = writer;
                find.startDate = new Date(startDate);
                find.endDate = new Date(endDate);
                find.state = state;
                await find.save();
                await event.sequelize.query(`DROP EVENT event${find.id}`);
                scheduler(state, find);
                return res.status(200).send({
                    data: null,
                    message: "수정 완료",
                });
            }
            scheduler(state, find);
            return res.status(200).send({
                data: null,
                message: "작성 완료",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ data: null, message: "오류" });
        }
    },
    delete: async (req, res) => {
        const authorization = req.headers.authorization;
        let admin = await token.storeCheck(authorization);
        if (!admin) {
            return res.status(403).send({
                data: null,
                message: "유효하지 않은 토큰 입니다.",
            });
        }
        const { id } = req.body;
        const deletEvent = await event.findOne({ where: { id: id } });
        deletEvent.delete = true;
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
            let admin = await token.storeCheck(authorization);
            if (!admin) {
                return res.status(403).send({
                    data: null,
                    message: "유효하지 않은 토큰 입니다.",
                });
            }
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

            let result = {
                rows: [],
                total: 0,
            };
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
        const authorization = req.headers.authorization;
        let admin = await token.storeCheck(authorization);
        if (!admin) {
            return res.status(403).send({
                data: null,
                message: "유효하지 않은 토큰 입니다.",
            });
        }
        const { id } = req.body;
        const findEvent = await event.findOne({ where: { id: id } });
        await event.create({
            img: findEvent.img,
            bannerImg: findEvent.bannerImg,
            writer: findEvent.writer,
            content: findEvent.content,
            title: findEvent.title,
            hide: findEvent.delete,
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
        const authorization = req.headers.authorization;
        let admin = await token.storeCheck(authorization);
        if (!admin) {
            return res.status(403).send({
                data: null,
                message: "유효하지 않은 토큰 입니다.",
            });
        }
        const { id } = req.query;
        const findEvent = await event.findOne({ where: { id: id } });
        return res.status(200).send({
            data: findEvent,
            message: "완료",
        });
    },
};
