const { Request, Response } = require("express");
const axios = require("axios");
const user = require("../../models/index.js").user;
const token = require("../../modules/token");
const FormData = require("form-data");
require("dotenv").config();

module.exports = {
    callbackAndroid: async (req, res) => {
        const { code, state, error, error_description } = req.query;
        if (error) {
            console.log(error, error_description);
            return res.send(error_description);
        }
        let config = {
            method: "get",
            url: `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&code=${code}&state=${state}`,
        };

        try {
            let response = await axios(config);
            var userData = await axios.get(
                "https://openapi.naver.com/v1/nid/me",
                {
                    headers: {
                        Authorization: `bearer ${response.data.access_token}`,
                    },
                }
            );
            let naverId = userData.data.response.id;
            let dataForm = new FormData();
            dataForm.append("id", naverId);

            let snsConfig = {
                method: "post",
                url: `${process.env.PY_API}/app/sociallogin`,
                headers: {
                    ...dataForm.getHeaders(),
                },
                data: dataForm,
            };
            try {
                let loginResult = await axios(snsConfig);
                if (loginResult.data.data !== null) {
                    let snsUser = loginResult.data.data;
                    let [User, created] = await user.findOrCreate({
                        where: {
                            id: snsUser.user_id,
                        },
                        defaults: {
                            id: snsUser.user_id,
                            idValue: naverId,
                            userName: snsUser.name,
                            email: snsUser.email === null ? "" : snsUser.email,
                            phoneNumber:
                                snsUser.cellphone === null
                                    ? ""
                                    : snsUser.cellphone,
                            gMoney: 0,
                            notiAlarm: true,
                            rute: "naver",
                            couponCount:
                                snsUser.coupon === null ? 0 : snsUser.coupon,
                        },
                    });
                    if (!created) {
                        User.userName = snsUser.name;
                        User.email =
                            snsUser.email === null ? "" : snsUser.email;
                        User.phoneNumber =
                            snsUser.cellphone === null ? "" : snsUser.cellphone;
                        User.couponCount =
                            snsUser.coupon === null ? 0 : snsUser.coupon;
                        await User.save();
                        let createToken = await token.make(User.id);
                        return res.redirect(
                            `intent://pay?token=${createToken}&status="ok"#Intent;scheme=maeulstorypay;end`
                        );
                    }
                    let createToken = await token.make(User.id);
                    return res.redirect(
                        `intent://pay?token=${createToken}&status="ok"#Intent;scheme=maeulstorypay;end`
                    );
                }
            } catch (error) {
                console.log(error);
                return res.redirect(
                    `intent://pay?token=${"???????????? ?????? ???????????????."}&status="no"#Intent;scheme=maeulstorypay;end`
                );
            }
        } catch (error) {
            console.log(error.data);
            return res.redirect(
                `intent://pay?token=${"???????????? ?????? ???????????????."}&status="no"#Intent;scheme=maeulstorypay;end`
            );
        }
    },
    callbackIos: async (req, res) => {
        const { code, state, error, error_description } = req.query;
        if (error) {
            console.log(error, error_description);
            return res.send(error_description);
        }
        let config = {
            method: "get",
            url: `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&code=${code}&state=${state}`,
        };

        try {
            let response = await axios(config);
            var userData = await axios.get(
                "https://openapi.naver.com/v1/nid/me",
                {
                    headers: {
                        Authorization: `bearer ${response.data.access_token}`,
                    },
                }
            );
            let naverId = userData.data.response.id;
            let dataForm = new FormData();
            dataForm.append("id", naverId);

            let snsConfig = {
                method: "post",
                url: `${process.env.PY_API}/app/sociallogin`,
                headers: {
                    ...dataForm.getHeaders(),
                },
                data: dataForm,
            };
            try {
                let loginResult = await axios(snsConfig);
                if (loginResult.data.data !== null) {
                    let snsUser = loginResult.data.data;
                    let [User, created] = await user.findOrCreate({
                        where: {
                            id: snsUser.user_id,
                        },
                        defaults: {
                            id: snsUser.user_id,
                            idValue: naverId,
                            userName: snsUser.name,
                            email: snsUser.email === null ? "" : snsUser.email,
                            phoneNumber:
                                snsUser.cellphone === null
                                    ? ""
                                    : snsUser.cellphone,
                            gMoney: 0,
                            notiAlarm: true,
                            rute: "naver",
                            couponCount:
                                snsUser.coupon === null ? 0 : snsUser.coupon,
                        },
                    });
                    if (!created) {
                        User.userName = snsUser.name;
                        User.email =
                            snsUser.email === null ? "" : snsUser.email;
                        User.phoneNumber =
                            snsUser.cellphone === null ? "" : snsUser.cellphone;
                        User.couponCount =
                            snsUser.coupon === null ? 0 : snsUser.coupon;
                        await User.save();
                        let createToken = await token.make(User.id);
                        return res.redirect(
                            `maeulstorypay://?token=${createToken}&status="ok"`
                        );
                    }
                    let createToken = await token.make(User.id);
                    return res.redirect(
                        `maeulstorypay://?token=${createToken}&status="ok"`
                    );
                }
            } catch (error) {
                console.log(error);
                return res.redirect(
                    `maeulstorypay://?token=${"???????????? ?????? ???????????????."}&status="no"`
                );
            }
        } catch (error) {
            console.log(error.data);
            return res.redirect(
                `maeulstorypay://?token=${"???????????? ?????? ???????????????."}&status="no"`
            );
        }
    },
};
