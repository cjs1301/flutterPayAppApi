const express = require("express");
const router = express.Router();
const { imageUpload } = require("../modules/multerConfig");
const {
    user, //user
    pay,
    gMoney,
    question,

    kakao, //sns
    naver,
    apple,

    refreshData, //app
    appListData,

    storeHome, //storeAdmin
    storeTransaction,
    noticeBoard,
    qnaHandler,

    adminHome, //admin
    adminLogin,
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

router.get("/", (req, res) => {
    res.send("Hello World");
});

//sns
router.post("/auth/kakao/callback", kakao.callback);
router.post("/auth/apple/callback", apple.callback);
router.get("/auth/naver/callback/android", naver.callbackAndroid); //andriod
router.get("/auth/naver/callback/ios", naver.callbackIos); //ios
//user
router.post("/user/login", user.login);
router.get("/user/info", user.info);

router.post("/user/fcmtoken", user.snsLoginGetFcmToken); //유저 기기토큰정보 저장하기
router.get("/user/transaction", user.monthTransaction); //월별 거래내역
router.get("/user/alarm", user.alarm); //알람 켜고 끄기
router.get("/user/alarm/list", user.alarmList); //내 알림 목록
router.get("/user/alarm/check", user.alarmCheck); //알림 읽음 처리
router.post("/user/info", user.uploadAndEditInfo); //소속 그룹 등록 및 수정

router.post("/user/buy", pay.buy);
router.get("/user/buy/check", pay.check); //결제전 포인트 쿠폰 상태 확인

router.get("/user/question", question.myQuestions); //1:1문의 목록
router.post("/user/question", question.upload); //문의글 등록

router.post("/user/wire", gMoney.send); //송금
router.get("/user/search", gMoney.sendUserSearch); //송금 대상 검색
router.get("/user/point", gMoney.point); //월별 포인트 사용적립 내역
router.get("/user/coupon", gMoney.coupon); //내가 가진 쿠폰 정보(사용된것 포함)
router.post("/user/coupon", gMoney.getCoupon); //쿠폰 코드 등록
router.post("/user/charge", gMoney.charge); //충전신청
router.get("/user/file/:name", gMoney.subscriptionDownload); //사용자 약정신청서 양식 다운로드
router.get("/user/subscription", gMoney.mySubscription); //약정충전 상태 확인
router.delete("/user/subscription", gMoney.deleteSubscription); //약정충전 해지 신청
router.post(
    //약정충전 신청서 업로드
    "/user/upload",
    imageUpload.single("file"),
    gMoney.subscriptionUpload,
    (error, req, res, next) => {
        console.log(error);
        return res.status(400).send({ message: error.message });
    }
);

//appAdmin
router.get("/admin/home", adminHome.homeInfo); //메인화면 정보
router.post("/admin/login", adminLogin.login); //가게관리자 로그인,운영관리자 로그인

router.get("/admin/charge/search", chargeHandler.chargeSearch); //충전신청자 검색
router.put("/admin/charge/state", chargeHandler.stateChange); //충전진행상태 변경
router.put("/admin/charge", chargeHandler.giveGmoney); //광화 충전

router.get("/admin/subscription/search", chargeHandler.subscriptionSearch);
router.put("/admin/subscription", chargeHandler.proceeding); //약정신청 진행중 변경
router.delete("/admin/subscription", chargeHandler.termination); //약정신청 해지
router.get("/subscriptionFile/upload/:name", chargeHandler.downLoad); //약정신청서 다운로드

router.get("/admin/transaction", adminTransactionHandler.search);
router.get("/admin/calculate", adminTransactionHandler.transaction);
router.get("/admin/calculate/download", adminTransactionHandler.download);
router.get("/admin/storelist", adminTransactionHandler.storelist);

router.get("/admin/event", eventHandler.search);
router.get("/admin/event/data", eventHandler.event);
router.post("/admin/event/copy", eventHandler.copy);
router.delete("/admin/event", eventHandler.delete);
router.post(
    "/admin/event",
    imageUpload.fields([
        { name: "img", maxCount: 1 },
        { name: "bannerImg", maxCount: 1 },
    ]),
    eventHandler.uploadAndEdit,
    (error, req, res, next) => {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
);
router.get("/admin/notice", noticeHandler.notice); //전체 공지
router.post("/admin/notice", noticeHandler.uploadEdit);
router.delete("/admin/notice", noticeHandler.delete);

router.get("/admin/storenotice", storeNoticeHandler.notice); //운영공지
router.post("/admin/storenotice", storeNoticeHandler.uploadEdit);
router.delete("/admin/storenotice", storeNoticeHandler.delete);

router.get("/admin/storequestion", storeQuestionHandler.storeQuestion); //운영문의
router.post("/admin/storequestion", storeQuestionHandler.answer);
router.delete("/admin/storequestion", storeQuestionHandler.delete);

router.get("/admin/faq", faqHandler.faq); //자주묻는 질문
router.post("/admin/faq", faqHandler.uploadEdit);
router.delete("/admin/faq", faqHandler.delete);

router.get("/admin/qna", questionHandler.questionList); //1:1문의
router.post("/admin/qna", questionHandler.answer);
router.put("/admin/qna", questionHandler.questionEdit);
router.delete("/admin/qna", questionHandler.delete);

router.post("/check/rtpay", rtpay.rtpay);

//storeAdmin
router.get("/store/admin/home", storeHome.homeInfo);

router.get("/store/admin/transaction", storeTransaction.search); //결제관리
router.put("/store/admin/transaction", storeTransaction.cancel);

router.get("/store/admin/calculate", storeTransaction.transaction); //정산관리
router.get("/store/admin/calculate/download", storeTransaction.download);

router.get("/store/admin/notice", noticeBoard.search);
router.post("/store/admin/qna", qnaHandler.question);
router.get("/store/admin/qna", qnaHandler.questionList);
router.delete("/store/admin/qna", qnaHandler.delete);

//app
router.get("/storelist", appListData.storeList);
router.get("/faqlist", appListData.faq);
router.get("/noticelist", appListData.notice);
router.get("/eventlist", appListData.event);
router.get("/update/store/list", refreshData.storeList);
router.get("/update/store/state", refreshData.storeState);
router.get("/update/store", refreshData.storeUpdate);
router.get("/store/search", appListData.searchStore);

//test
router.get("/test", async (req, res) => {
    const user = require("../models/index").user;
    const charge = require("../models/index").charge;
    let find = user.findOne({
        where: { id: 1 },
    });
    for (let i = 0; i < 4; i++) {
        await charge.create({
            userId: find.id,
            userName: find.name,
            money: 1000,
            phoneNumber: find.phoneNumber,
            email: find.email,
            state: "충전신청",
        });
    }
    let a = await user.create({
        userName: "김수진",
        email: "doubleCar@gmail.com",
        phoneNumber: "01001120112",
        gMoney: 0,
        fcmToken: "test",
    });
    await charge.create({
        userId: a.id,
        userName: a.name,
        money: 1000,
        phoneNumber: a.phoneNumber,
        email: a.email,
        state: "충전신청",
    });
    res.send("ok");
});
router.get("/test2", async (req, res) => {
    const user = require("../models/index").user;
    const charge = require("../models/index").charge;
    let find = await user.findOne({
        where: { id: 1 },
    });
    for (let i = 0; i < 4; i++) {
        await charge.create({
            userId: find.id,
            userName: find.name,
            money: 1000,
            phoneNumber: find.phoneNumber,
            email: find.email,
            state: "충전신청",
        });
    }
    res.send("ok");
});

module.exports = router;
