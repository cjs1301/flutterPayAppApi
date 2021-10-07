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
router.get("/userinfo", user.info);
router.get("/transaction", user.monthTransaction);
router.post("/buy", pay.buy);
router.get("/charge", gMoney.charge);
router.post("/subscription");
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
//router.post("/answer", gMoneyHandler.answer);
router.post("/notice", notice.uploadAndEdit);
//router.post("/coupon", gMoneyHandler.giveCoupon);
//router.post("/gmoney", gMoneyHandler.giveGmoney);
//router.post("/gpoint", gMoneyHandler.giveGpoint);
//router.post("/faq", appHandler);
//router.delete("/faq", appHandler);
router.delete("/storeinfo");
router.delete("/notice", notice.delete);
router.post("/storeinfo");
//storeAdmin

//app
router.get("/storelist", appListData.store);
router.get("/faqlist", appListData.faq);
router.get("/noticelist", appListData.notice);
router.get("/eventlist", appListData.event);
router.get("/storeinfo");
router.get("/store");

module.exports = router;
