const { Request, Response } = require("express");
const { QueryTypes } = require("sequelize");

module.exports = {
    event: async (req, res) => {
        let eventList = await sequelize.query("SELECT bannerImg FROM events", {
            type: QueryTypes.SELECT,
        });
        res.send({ data: eventList, message: "성공" });
    },

    manyAsk: async (req, res) => {
        let manyAskList = await sequelize.query("SELECT title FROM manyAsks", {
            type: QueryTypes.SELECT,
        });
        res.send({ data: manyAskList, message: "성공" });
    },

    notice: async (req, res) => {
        let noticeList = await sequelize.query("SELECT title FROM notices", {
            type: QueryTypes.SELECT,
        });
        res.send({ data: noticeList, message: "성공" });
    },

    store: async (req, res) => {
        let storeList = await await sequelize.query(
            "SELECT name, location, callNumber, logoImg FROM events",
            { type: QueryTypes.SELECT }
        );
        res.send({ data: storeList, message: "성공" });
    },
};
