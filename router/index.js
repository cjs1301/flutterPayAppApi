const express = require("express");
const router = express.Router();
const {
    user,
    pay,
    gMoney,
    storeHandler,
    appListData,
    eventHandler,
    notice,
    appHandler,
    gMoneyHandler,
    kakao,
    naver,
    refreshData,
    question,
    rtpay,
} = require("../controllers/index");
const pushEvent = require("../controllers/push");
const { imageUpload } = require("../multerConfig");

router.get("/", (req, res) => {
    res.send({ title: "Hello World" });
});
//user
router.get("/user/info", user.info);
router.get("/user/transaction", user.monthTransaction);
router.post("/user/buy", pay.buy);
router.get("/user/buy/check", pay.check);
router.get("/user/coupon", gMoney.coupon);
router.post("/user/charge", gMoney.charge);
router.post("/user/subscription");
router.post(
    "/user/upload",
    imageUpload.single("image"),
    gMoney.subscriptionUpload,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get("/user/pdf", gMoney.subscriptionDownload);
router.get("/user/alarm", user.alarm);
router.post("/user/wire", gMoney.send);
router.get("/user/search", gMoney.sendUserSearch);
router.post("/user/info", user.uploadAndEditInfo);
router.post("/user/login", user.login);
router.post("/user/fcmtoken", user.snsLoginGetFcmToken);
router.get("/user/question", question.myQuestions);
router.post("/user/question", question.uploadAndEdit);

//appAdmin
router.post("/admin/event", eventHandler.uploadAndEdit);
router.delete("/admin/event", eventHandler.delete);
//router.post("/admin/answer", gMoneyHandler.answer);
router.post("/admin/notice", notice.uploadAndEdit);
//router.post("/admin/coupon", gMoneyHandler.giveCoupon);
//router.post("/admin/gmoney", gMoneyHandler.giveGmoney);
router.get("/admin/charge/search", gMoneyHandler.chargeSearch);
//router.post("/admin/gpoint", gMoneyHandler.giveGpoint);
//router.post("/admin/faq", appHandler);
//router.delete("/admin/faq", appHandler);
router.delete("/admin/store");
router.delete("/admin/notice", notice.delete);
router.post("/admin/store");
router.post("/check/rtpay", rtpay.rtpay);
//storeAdmin

//app
router.get("/storelist", appListData.storeList);
router.get("/faqlist", appListData.faq);
router.get("/noticelist", appListData.notice);
router.get("/eventlist", appListData.event);
router.get("/storeinfo", appListData.store);
router.get("/store");
router.get("/moveapp", (req, res) =>
    res.redirect(
        "intent://re:https://m.maeulstory.net#Intent;scheme=maeulstory;end"
    )
);
router.get("/refreshdata", refreshData.storeList);

//sns
//`https://kauth.kakao.com/oauth/authorize?client_id=${}&redirect_uri=${process.env.SERVER}/auth/kakao/callback&response_type=code&prompt=login`
router.get("/auth/kakao/callback", kakao.callback);
//`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${}&redirect_uri=${process.env.SERVER}/auth/naver/callback&state=1234`
router.get("/auth/naver/callback", naver.callback);

router.get("/push", (req, res) => {
    pushEvent.data(
        "1234",
        "ddBxHrmvSRqtqOzh0T3g3A:APA91bHx6ojfofa8R7sHJEBvYC5SQDyD0TkLrOfIUShNdXkJq3D0AMZ2l8jnk_aCjImcCNhGXwCO5SlWAjTmXXB3LAuFo-7dE2MjUbm0TeTJPU57g5mZxlcnzDbkb6CkN9NcALFnawYi"
    );
    res.send("hi");
});
router.get("/pushnoti", pushEvent.noti);

//test
const users = require("../models/index.js").user;
router.get("/showmethemoney", async (req, res) => {
    let find = await users.findAll({
        where: {
            userName: "윤현수",
        },
    });
    find.forEach(async (element) => {
        element.gMoney = 99999999;
        await element.save();
    });
    pushEvent.data(
        "99999999",
        "ddBxHrmvSRqtqOzh0T3g3A:APA91bHx6ojfofa8R7sHJEBvYC5SQDyD0TkLrOfIUShNdXkJq3D0AMZ2l8jnk_aCjImcCNhGXwCO5SlWAjTmXXB3LAuFo-7dE2MjUbm0TeTJPU57g5mZxlcnzDbkb6CkN9NcALFnawYi"
    );
    res.send("돈이좋아!!");
});
router.get("/testtest", gMoney.test);
router.get("/testtest2", gMoney.test2);

module.exports = router;
