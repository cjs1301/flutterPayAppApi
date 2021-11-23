const { Request, Response, response } = require("express");
const event = require("../models/index.js").event;
const faq = require("../models/index.js").faq;
const notice = require("../models/index.js").notice;
const store = require("../models/index.js").store;
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
            where: { isShow: true, hide: false },
        });
        res.send({ data: faqList, message: "성공" });
    },

    notice: async (req, res) => {
        let noticeList = await notice.findAll({
            where: { isShow: true, hide: false },
        });
        res.send({ data: noticeList, message: "성공" });
    },

    storeList: async (req, res) => {
        let storeList = await store.findAll({
            where: { isShow: true },
            order: [["name", "ASC"]],
        });
        return res.send({ data: storeList, message: "성공" });
    },
    searchStore: async (req, res) => {
        const { word, address } = req.query;
        console.log(req.query);
        const URI = `${process.env.PY_API}/app/store?word=${word}&address=${address}`;
        const encodedURI = encodeURI(URI);
        try {
            let config = {
                method: "get",
                url: encodedURI,
            };
            let result = await axios(config);
            let arr = [];
            console.log(result.data);
            result.data.data.forEach((el) => {
                arr.push(el.id);
            });
            console.log(arr);
            if (arr.length === 0) {
                return res.send({ data: null, message: "성공" });
            }
            let searchResult = await store.findAll({
                where: {
                    id: {
                        [Op.or]: arr,
                    },
                },
                order: [["name", "ASC"]],
            });
            //console.log(searchResult);
            return res.send({ data: searchResult, message: "성공" });
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
};
