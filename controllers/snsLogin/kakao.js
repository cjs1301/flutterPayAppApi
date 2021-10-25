const { Request, Response } = require("express");
const axios = require("axios");
const user = require("../../models/index.js").user;
const token = require("../token/accessToken");
const FormData = require("form-data");
const qs = require("qs");
require("dotenv").config();

module.exports = {
    callback: async (req, res) => {
        const { code } = req.query;
        let data = qs.stringify({
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_CLIENT_ID,
            redirect_uri: `${process.env.SERVER}/auth/kakao/callback`,
            code: code,
        });
        let config = {
            method: "post",
            url: "https://kauth.kakao.com/oauth/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
        };
        try {
            let response = await axios(config);
            let userId = await axios.get(
                "https://kapi.kakao.com/v1/user/access_token_info",
                {
                    headers: {
                        Authorization: `bearer ${response.data.access_token}`,
                        "Content-type": "application/x-www-form-urlencoded",
                    },
                }
            );

            let userData = await axios.get(
                `https://kapi.kakao.com/v2/user/me?target_id_type=user_id&target_id=${userId.data.id}`,
                {
                    headers: {
                        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
                        "Content-type": "application/x-www-form-urlencoded",
                    },
                }
            );
            let kakaoId = "kko" + userData.data.id;
            let dataForm = new FormData();
            dataForm.append("id", kakaoId);

            let snsConfig = {
                method: "post",
                url: `${process.env.TEST_API}/app/sociallogin`,
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
                            userName: snsUser.name,
                            email: snsUser.email === null ? "" : snsUser.email,
                            phoneNumber:
                                snsUser.cellphone === null
                                    ? ""
                                    : snsUser.cellphone,
                            gMoney: 0,
                            gPoint:
                                snsUser.gPoint === null ? 0 : snsUser.gPoint,
                            notiAlram: true,
                            activityArea: "",
                            rute: "kakao",
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
                        res.send({
                            data: null,
                            message: "카카오로 로그인하셨습니다",
                        });
                    }
                    let createToken = await token.make(User.id);
                    return res.redirect(
                        `intent://pay?token=${createToken}&status="ok"#Intent;scheme=maeulstorypay;end`
                    );
                    res.send({
                        data: null,
                        message: "카카오로 로그인하셨습니다",
                    });
                }
            } catch (error) {
                console.log(error);
                return res.redirect(
                    `intent://pay?token=${"확인되지 않는 회원입니다."}&status="no"#Intent;scheme=maeulstorypay;end`
                );
                res.status(403).send({
                    data: null,
                    message: "확인되지 않는 회원입니다",
                });
            }
        } catch (error) {
            console.log(error.data);
            return res.redirect(
                `intent://pay?token=${"확인되지 않는 회원입니다."}&status="no"#Intent;scheme=maeulstorypay;end`
            );
            res.status(403).send({
                data: null,
                message: "카카오 로그인이 되지 않았습니다.",
            });
        }
    },
};
