const { Request, Response } = require("express");
const event = require("../models/index.js").event;
const faq = require("../models/index.js").faq;
const notice = require("../models/index.js").notice;
const store = require("../models/index.js").store;
const { QueryTypes } = require("sequelize");

module.exports = {
    event: async (req, res) => {
        let eventList = await event.findAll();
        res.send({ data: eventList, message: "성공" });
    },

    faq: async (req, res) => {
        let faqList = await faq.findAll();
        res.send({ data: faqList, message: "성공" });
    },

    notice: async (req, res) => {
        let noticeList = await notice.findAll();
        res.send({ data: noticeList, message: "성공" });
    },

    store: async (req, res) => {
        let storeList = await store.findAll();
        res.send({ data: storeList, message: "성공" });
    },
};

// let storeList = await await sequelize.query(
//     "SELECT name, location, callNumber, logoImg FROM events",
//     { type: QueryTypes.SELECT }
// );
