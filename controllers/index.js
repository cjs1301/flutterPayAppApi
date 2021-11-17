//user
const user = require("./user/user");
const pay = require("./user/pay");
const gMoney = require("./user/gMoney");
const question = require("./user/question");

//store
const qnaHandler = require("./store/qnaHandler");
const storeTransaction = require("./store/transactionHandler");
const storeHome = require("./store/home");
const noticeBoard = require("./store/noticeBoard");

//admin
const adminLogin = require("./admin/adminlogin");
const adminHome = require("./admin/home");
const chargeHandler = require("./admin/chargeHandler");
const adminTransactionHandler = require("./admin/transactionHandler");
const eventHandler = require("./admin/eventHandler");
const rtpay = require("./admin/rtpay");
const noticeHandler = require("./admin/noticeHandler");
const faqHandler = require("./admin/faqHandler");
const storeNoticeHandler = require("./admin/storeNoticeHandler");
const storeQuestionHandler = require("./admin/storeQuestionHandler");
const questionHandler = require("./admin/questionHandler");

//app
const appListData = require("./appListData");
const refreshData = require("./refreshData");

//snsLogin
const kakao = require("./snsLogin/kakao");
const naver = require("./snsLogin/naver");
module.exports = {
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
};
