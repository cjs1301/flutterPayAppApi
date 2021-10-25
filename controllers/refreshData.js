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
    storeList: async (req, res) => {
        //기존데이터 요청
        try {
            let originStore = await axios.get(
                `${process.env.TEST_API}/app/storelist`
            );

            let originList = originStore.data.data;

            originList.forEach(async (el) => {
                let origin = await axios.get(
                    `${process.env.TEST_API}/app/store?storeid=${el.store_id}`
                );
                let originData = origin.data.data;
                let [newStore, created] = await store.findOrCreate({
                    where: { storeCode: el.store_id },
                    defaults: {
                        id: el.store_id,
                        name: el.name,
                        introduction: originData.introduction,
                        ceo: originData.ceo,
                        address: el.address,
                        phone: el.phone,
                        logoImg: el.logoImg,
                        img: `${originData.img}`,
                    },
                });
                if (created && el.address !== "") {
                    let result = await axios.get(
                        `https://dapi.kakao.com/v2/local/search/address.json?page=1&size=10&query=${encodeURI(
                            el.address
                        )}`,
                        {
                            headers: {
                                Authorization:
                                    "KakaoAK 39079f0bc75652e1041282420d8f0bf1",
                            },
                        }
                    );
                    newStore.x = result.data.documents[0].address.x;
                    newStore.y = result.data.documents[0].address.y;
                    newStore.save();
                }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
        return res.send({ data: null, message: "성공" });
    },
    storeListSet: async () => {
        //기존데이터 요청
        try {
            let originStore = await axios.get(
                `${process.env.TEST_API}/app/storelist`
            );

            let originList = originStore.data.data;

            originList.forEach(async (el) => {
                let origin = await axios.get(
                    `${process.env.TEST_API}/app/store?storeid=${el.store_id}`
                );
                let originData = origin.data.data;

                let [newStore, created] = await store.findOrCreate({
                    where: { id: el.store_id },
                    defaults: {
                        id: el.store_id,
                        name: el.name === null ? "" : `${el.name}`.trim(),
                        introduction:
                            originData.introduction === null
                                ? ""
                                : `${originData.introduction}`.trim(),
                        ceo:
                            originData.ceo === null
                                ? ""
                                : `${originData.ceo}`.trim(),
                        address:
                            el.address === null ? "" : `${el.address}`.trim(),
                        phone: el.phone === null ? "" : `${el.phone}`.trim(),
                        logoImg:
                            el.logoImg === null ? "" : `${el.logoImg}`.trim(),
                        img: `${originData.img}`.trim(),
                    },
                });
                if (created && el.address !== "") {
                    let result = await axios.get(
                        `https://dapi.kakao.com/v2/local/search/address.json?page=1&size=10&query=${encodeURI(
                            el.address
                        )}`,
                        {
                            headers: {
                                Authorization:
                                    "KakaoAK 39079f0bc75652e1041282420d8f0bf1",
                            },
                        }
                    );
                    newStore.x = result.data.documents[0].address.x;
                    newStore.y = result.data.documents[0].address.y;
                    newStore.save();
                } else if (created && el.address === "") {
                    newStore.x = "";
                    newStore.y = "";
                    newStore.save();
                }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
        return;
    },
    finish: async (res, req) => {
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
