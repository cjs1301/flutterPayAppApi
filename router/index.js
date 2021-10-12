const express = require("express");
const router = express.Router();
const {
    user,
    pay,
    gMoney,
    question,
    storeHandler,
    answer,
    appListData,
    event,
    notice,
    appHandler,
    gMoneyHandler,
} = require("../controllers/index");

router.get("/", (req, res) => {
    res.send({ title: "Hello World" });
});
//user
router.get("/user/info", user.info);
router.get("/user/transaction", user.monthTransaction);
router.post("/user/buy", pay.buy);
router.get("/user/charge", gMoney.charge);
router.post("/user/subscription");
router.post("/user/password", user.uploadPassword);
router.put("/user/password", user.editPassword);
router.get("/user/alarm");
router.post("/user/wire", gMoney.send);
router.get("/user/search", gMoney.sendUserSearch);
router.post("/user/info", user.uploadAndEditInfo);
//appAdmin
//router.post("/admin/event", event.uploadAndEdit);
//router.delete("/admin/event", event.delete);
//router.post("/admin/answer", gMoneyHandler.answer);
router.post("/admin/notice", notice.uploadAndEdit);
//router.post("/admin/coupon", gMoneyHandler.giveCoupon);
//router.post("/admin/gmoney", gMoneyHandler.giveGmoney);
//router.post("/admin/gpoint", gMoneyHandler.giveGpoint);
//router.post("/admin/faq", appHandler);
//router.delete("/admin/faq", appHandler);
router.delete("/admin/store");
router.delete("/admin/notice", notice.delete);
router.post("/admin/store");
//storeAdmin

//app
router.get("/storelist", appListData.store);
router.get("/faqlist", appListData.faq);
router.get("/noticelist", appListData.notice);
router.get("/eventlist", appListData.event);
router.get("/storeinfo");
router.get("/store");

//sns
// app.get("/auth/kakao", (req, res) => {
//     const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile,account_email`;
//     res.redirect(kakaoAuthURL);
// });

module.exports = router;
