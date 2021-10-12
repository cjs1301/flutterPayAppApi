const event = require("./models/index.js").event;
const faq = require("./models/index.js").faq;
const notice = require("./models/index.js").notice;
const store = require("./models/index.js").store;
const user = require("./models/index.js").user;
const transaction = require("./models/index.js").transaction;

module.exports = async () => {
    for (let i = 0; i < 20; i++) {
        await event.create({
            img: "메인이미지uri",
            bannerImg: "배너이미지uri",
            content:
                "전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! ",
            title: `오픈이벤트${i}`,
        });
        await faq.create({
            content:
                "전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! ",
            title: `진짜 할인해주나요?${i}`,
        });
        await notice.create({
            content:
                "페이앱으로 편하게 현금,카드 없이 어디서나! 페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!",
            title: `앱사용 규칙 공지${i}`,
        });
        await store.create({
            name: `가게${i}`,
            introduction:
                "우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!우리가게가 짱이야!!!",
            location: "강남어딘가",
            ownerName: "박보검",
            callNumber: "01012345678",
            openingHours: "10:00am ~ 7:00pm",
            logoImg: "로고이미지uri",
            img: "메인이미지uri",
        });
    }
    await user.create({
        userCode: 1293940,
        userName: "박보검",
        email: "hi@gmail.com",
        phoneNumber: "01012345678",
        gMoney: "284000",
        alram: true,
        paymentPassword: "0000",
        activityArea: null,
        belongGroup: null,
    });
    await transaction.create({
        userId: 1,
        transactionTypeId: 4,
        storeId: 2,
        price: 1000,
        gMoney: 1000,
        gPoint: 10,
        state: "결제완료",
    });
    await transaction.create({
        userId: 1,
        transactionTypeId: 4,
        storeId: 2,
        price: 1000,
        gMoney: 1000,
        gPoint: 10,
        state: "결제완료",
    });
    await transaction.create({
        userId: 1,
        transactionTypeId: 4,
        storeId: 2,
        price: 1000,
        gMoney: 1000,
        gPoint: 10,
        state: "결제완료",
    });
};
