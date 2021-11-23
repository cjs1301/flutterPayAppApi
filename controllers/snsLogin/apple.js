const { Request, Response } = require("express");
const axios = require("axios");
const user = require("../../models/index.js").user;
const token = require("../../modules/token");
const FormData = require("form-data");
require("dotenv").config();

module.exports = {
    callback: async (req, res) => {
        try {
            const { userID } = req.body;
            let appleId = userID;
            let dataForm = new FormData();
            dataForm.append("id", appleId);

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
                            idValue: appleId,
                            userName: snsUser.name,
                            email: snsUser.email === null ? "" : snsUser.email,
                            phoneNumber:
                                snsUser.cellphone === null
                                    ? ""
                                    : snsUser.cellphone,
                            gMoney: 0,
                            gPoint:
                                snsUser.gPoint === null ? 0 : snsUser.gPoint,
                            notiAlarm: true,
                            belongGroup: "",
                            rute: "apple",
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
                        return res.send({
                            data: createToken,
                            message: "애플로 로그인하셨습니다",
                        });
                    }
                    let createToken = await token.make(User.id);
                    return res.send({
                        data: createToken,
                        message: "애플로 로그인하셨습니다",
                    });
                }
            } catch (error) {
                console.log(error);
                return res.status(403).send({
                    data: null,
                    message: "미가입 회원입니다.",
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                data: null,
                message: "애플 로그인이 되지 않았습니다.",
            });
        }
    },
};
