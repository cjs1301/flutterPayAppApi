const express = require("express");
const fs = require("fs");
const router = express.Router();
const {
    user, //user
    pay,
    gMoney,
    question,

    kakao, //sns
    naver,

    refreshData, //app
    appListData,

    storeHome, //storeAdmin
    storeTransaction,
    noticeBoard,
    qnaHandler,

    adminHome, //admin
    chargeHandler,
    adminTransactionHandler,
    eventHandler,
    noticeHandler,
    faqHandler,
    storeNoticeHandler,
    storeQuestionHandler,
    questionHandler,
    rtpay,
} = require("../controllers/index");

const { imageUpload } = require("../multerConfig");

router.get("/", (req, res) => {
    res.send({ title: "Hello World" });
});
//user
router.get("/user/info", user.info);
router.get("/user/transaction", user.monthTransaction); //월별 거래내역
router.post("/user/buy", pay.buy);
router.get("/user/buy/check", pay.check); //결제전 포인트 쿠폰 상태 확인
router.get("/user/coupon", gMoney.coupon); //내가 가진 쿠폰 정보(사용된것 포함)
router.post("/user/coupon", gMoney.getCoupon); //쿠폰 코드 등록
router.post("/user/charge", gMoney.charge);
router.get("/user/subscription", gMoney.mySubscription); //약정충전 상태 확인
router.delete("/user/subscription", gMoney.deleteSubscription); //약정충전 해지 신청
router.post(
    "/user/upload",
    imageUpload.single("file"),
    gMoney.subscriptionUpload,
    (error, req, res, next) => {
        console.log(error);
        console.log(req.file, "파일!!!");
        res.status(400).send({ message: error.message });
    }
);
router.get("/user/flie/:name", gMoney.subscriptionDownload);
router.get("/user/alarm", user.alarm); //알람 켜고 끄기
router.get("/user/alarm/list", user.alarmList); //내 알림 목록
router.get("/user/alarm/check", user.alarmCheck); //알림 읽음 처리
router.post("/user/wire", gMoney.send); //송금
router.get("/user/search", gMoney.sendUserSearch); //송금 대상 검색
router.post("/user/info", user.uploadAndEditInfo); //소속 그룹 등록 및 수정
router.post("/user/login", user.login);
router.post("/user/fcmtoken", user.snsLoginGetFcmToken); //유저 기기토큰정보 저장하기
router.get("/user/question", question.myQuestions); //1:1문의 목록
router.post("/user/question", question.upload); //문의글 등록
router.get("/user/point", gMoney.point); //월별 포인트 사용적립 내역

//appAdmin
router.get("/admin/home", adminHome.homeInfo);
router.get("/admin/charge/search", chargeHandler.chargeSearch);
router.put("/admin/charge/state", chargeHandler.stateChange);
router.get("/admin/subscription/search", chargeHandler.subscriptionSearch);
router.get("/admin/transaction", adminTransactionHandler.search);
router.get("/admin/calculate", adminTransactionHandler.transaction);
router.get("/admin/storelist", adminTransactionHandler.storelist);
router.get("/admin/event", eventHandler.search);
router.post("/admin/event/copy", eventHandler.copy);
router.post(
    "/admin/event",
    imageUpload.fields([
        { name: "img", maxCount: 1 },
        { name: "bannerImg", maxCount: 1 },
    ]),
    eventHandler.uploadAndEdit,
    (error, req, res, next) => {
        console.log(error);
        console.log(req.files, "파일!!!");
        res.status(400).send({ message: error.message });
    }
);
router.delete("/admin/event", eventHandler.delete);
router.get("/admin/notice", noticeHandler.notice);
router.post("/admin/notice", noticeHandler.uploadEdit);
router.delete("/admin/notice", noticeHandler.delete);
router.get("/admin/stroenotice", storeNoticeHandler.notice);
router.post("/admin/stroenotice", storeNoticeHandler.uploadEdit);
router.delete("/admin/stroenotice", storeNoticeHandler.delete);
router.get("/admin/stroequestion", storeQuestionHandler.storeQuestion);
router.get("/admin/faq", faqHandler.faq);
router.post("/admin/faq", faqHandler.uploadEdit);
router.delete("/admin/faq", faqHandler.delete);
router.get("/admin/qna", questionHandler.questionList);
router.post("/admin/qna", questionHandler.answer);
router.put("/admin/qna", questionHandler.questionEdit);
router.delete("/admin/qna", questionHandler.delete);

router.post("/check/rtpay", rtpay.rtpay);
//storeAdmin
router.get("/store/admin/home", storeHome.homeInfo);
router.get("/store/admin/transaction", storeTransaction.search);
router.get("/store/admin/calculate", storeTransaction.transaction);
router.put("/store/admin/transaction", storeTransaction.cancel);
router.get("/store/admin/notice", noticeBoard.search);
router.post("/store/admin/qna", qnaHandler.question);
router.get("/store/admin/qna", qnaHandler.questionList);
router.delete("/store/admin/qna", qnaHandler.delete);

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

router.get("/m", async function (req, res) {
    try {
        const { name } = req.query;
        const user = require("../models/index.js").user;
        const pushEvent = require("../controllers/push");
        let give = await user.findOne({
            where: { userName: name },
        });
        give.gMoney = give.gMoney + 10000;
        give.save();
        let contents = {
            title: "충전완료 알림",
            body: "신청하신 " + 10000 + "화\n 충전이\\n 완료\n되었습니다",
        };
        pushEvent.data("/user/info", give.fcmToken);
        pushEvent.noti(contents, give.fcmToken);
        res.send("ok");
    } catch (error) {
        console.log(error);
        res.send("no");
    }
});

module.exports = router;
