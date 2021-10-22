const event = require("./models/index.js").event;
const faq = require("./models/index.js").faq;
const notice = require("./models/index.js").notice;
const store = require("./models/index.js").store;
const user = require("./models/index.js").user;
const charge = require("./models/index.js").charge;
const transaction = require("./models/index.js").transaction;
const question = require("./models/index.js").question;

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
    }
    await user.create({
        userCode: 1,
        userName: "박보검",
        email: "hi@gmail.com",
        phoneNumber: "01012345678",
        gMoney: 2840000,
        alram: true,
        activityArea: null,
        belongGroup: null,
    });
    await user.create({
        userCode: 1295,
        userName: "홍길동",
        email: "hi2@gmail.com",
        phoneNumber: "01012345679",
        gMoney: 1000,
        alram: true,
        activityArea: null,
        belongGroup: null,
    });
    await user.create({
        userCode: 288,
        userName: "윤현수",
        email: "hi2@gmail.com",
        phoneNumber: "01012345679",
        gMoney: 9000000,
        alram: true,
        activityArea: null,
        belongGroup: null,
    });
    await charge.create({
        userId: 2,
        userName: "홍길동",
        money: 1000,
        phoneNumber: "01012345679",
        email: "hi2@gmail.com",
        state: "충전신청",
    });
    for (let i = 0; i < 10; i++) {
        await question.create({
            userId: 1,
            content:
                "어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!",
            title: `질문${i}`,
        });
    }
};
