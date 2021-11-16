const { Request, Response, response } = require("express");
const event = require("../models/index.js").event;
const faq = require("../models/index.js").faq;
const notice = require("../models/index.js").notice;
const store = require("../models/index.js").store;
const storeImg = require("../models/index.js").storeImg;
const { Op } = require("sequelize");
const axios = require("axios");
require("dotenv").config();

module.exports = {
    event: async (req, res) => {
        let eventList = await event.findAll({
            where: { isShow: true, hide: false },
        });
        res.send({ data: eventList, message: "성공" });
    },

    faq: async (req, res) => {
        let faqList = await faq.findAll({
            where: { isShow: true },
        });
        res.send({ data: faqList, message: "성공" });
    },

    notice: async (req, res) => {
        let noticeList = await notice.findAll({
            where: { isShow: true },
        });
        res.send({ data: noticeList, message: "성공" });
    },

    storeList: async (req, res) => {
        let storeList = await store.findAll();
        return res.send({ data: storeList, message: "성공" });
    },
    store: async (req, res) => {
        const { storeid } = req.query;
        let orginData = await axios.get(
            `${process.env.TEST_API}/app/store?storeid=${storeid}`
        );
        let findStore = await store.findOne({
            where: {
                storeCode: storeid,
                [Op.or]: {
                    ceo: null,
                    introduction: null,
                    logoImg: null,
                },
            },
        });
        if (findStore) {
            findStore.ceo = orginData.data.ceo;
        }
        res.send({ data: noticeList, message: "성공" });
    },
};
