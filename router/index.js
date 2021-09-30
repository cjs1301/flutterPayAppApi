const express = require("express");
const router = express.Router();
const {
    user,
    pay,
    gMoney,
    ask,
    storeHandler,
    answer,
    appListData,
} = require("../controllers/index");

router.get("/", (req, res) => {
    res.send({ title: "Hello World" });
});

router.get("/getuserinfo", user.info);
router.get("/mouthtransaction", user.mouthTransaction);
router.post("/buy", pay.buy);
router.post("/requestcharge", gMoney.charge);

module.exports = router;
