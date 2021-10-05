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
    userHandler,
} = require("../controllers/index");

router.get("/", (req, res) => {
    res.send({ title: "Hello World" });
});
//user
router.get("/userinfo", user.info);
router.get("/transaction", user.monthTransaction);
router.post("/buy", pay.buy);
router.get("/charge", gMoney.charge);
router.post("/contractcharge");
router.post("/password", user.uploadPassword);
router.put("/password", user.editPassword);
router.get("/logout");
router.get("/alarm");
router.post("/wire", gMoney.send);
router.get("/senduser", gMoney.sendUserSearch);
router.post("/userinfo", user.uploadAndEditInfo);
//appAdmin
router.post("/event", event.uploadAndEdit);
router.delete("/event", event.delete);
router.post("/answer", userHandler.answer);
router.post("/notice", notice.uploadAndEdit);
router.post("/coupon", userHandler.giveCoupon);
router.post("/gmoney", userHandler.giveGmoney);
router.post("/gpoint", userHandler.giveGpoint);
//router.post("/faq", appHandler);
//router.delete("/faq", appHandler);
router.delete("/storeinfo");
router.delete("/notice", notice.delete);
router.post("/storeinfo");
//storeAdmin

//app
router.get("/storelist");
router.get("/faqlist");
router.get("/noticelist");
router.get("/eventlist");
router.get("/storeinfo");
router.get("/store");

module.exports = router;
