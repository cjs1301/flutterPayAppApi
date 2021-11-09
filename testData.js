const event = require("./models/index.js").event;
const faq = require("./models/index.js").faq;
const notice = require("./models/index.js").notice;
const store = require("./models/index.js").store;
const user = require("./models/index.js").user;
const charge = require("./models/index.js").charge;
const transaction = require("./models/index.js").transaction;
const question = require("./models/index.js").question;
const storeQuestion = require("./models/index.js").storeQuestion;
const storeAnswer = require("./models/index.js").storeAnswer;
const moment = require("moment");

module.exports = async () => {
    // for (let i = 0; i < 20; i++) {
    //     await event.create({
    //         img: "메인이미지uri",
    //         bannerImg: "배너이미지uri",
    //         content:
    //             "전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! ",
    //         title: `오픈이벤트${i}`,
    //     });
    //     await faq.create({
    //         content:
    //             "전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! 전품목을 5% 할인해드려요!! ",
    //         title: `진짜 할인해주나요?${i}`,
    //     });
    //     await notice.create({
    //         content:
    //             "페이앱으로 편하게 현금,카드 없이 어디서나! 페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!",
    //         title: `앱사용 규칙 공지${i}`,
    //     });
    // }
    // await user.create({
    //     id: 1,
    //     userName: "박보검",
    //     email: "hi@gmail.com",
    //     phoneNumber: "01012345678",
    //     gMoney: 2840000,
    //     notiAlarm: true,
    //     belongGroup: null,
    // });
    // await user.create({
    //     id: 2,
    //     userName: "박보검",
    //     email: "hi@gmail.com",
    //     phoneNumber: "01012345678",
    //     gMoney: 2840000,
    //     notiAlarm: true,
    //     belongGroup: null,
    // });
    // await user.create({
    //     id: 222,
    //     userName: "최재송",
    //     email: "hi@gmail.com",
    //     phoneNumber: "01012345678",
    //     gMoney: 2840000,
    //     notiAlarm: true,
    //     belongGroup: null,
    // });
    // await user.create({
    //     id: 223,
    //     userName: "최재송",
    //     email: "hi@gmail.com",
    //     phoneNumber: "01012345678",
    //     gMoney: 2840000,
    //     notiAlarm: true,
    //     belongGroup: null,
    // });
    // await user.create({
    //     id: 1295,
    //     userName: "홍길동",
    //     email: "hi2@gmail.com",
    //     phoneNumber: "01012345679",
    //     gMoney: 1000,
    //     notiAlarm: true,
    //     belongGroup: null,
    // });
    // await user.create({
    //     id: 288,
    //     userName: "윤현수",
    //     email: "hi2@gmail.com",
    //     phoneNumber: "01012345679",
    //     gMoney: 9000000,
    //     rute: "kakao",
    //     notiAlarm: true,
    //     belongGroup: null,
    // });
    // await charge.create({
    //     userId: 288,
    //     userName: "윤현수",
    //     money: 1000,
    //     phoneNumber: "01012345679",
    //     email: "hi2@gmail.com",
    //     state: "충전신청",
    // });
    // // for (let i = 0; i < 10; i++) {
    // //     await question.create({
    // //         userId: 288,
    // //         content:
    // //             "어디서나!페이앱으로 편하게 현금없이 어디서나!페이앱으로 편하게 현금없이 어디서나!",
    // //         title: `질문${i}`,
    // //     });
    // // }
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-09-30 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-09-30 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-09-30 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1300,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "결제완료",
    //     minus: true,
    //     createdAt: new Date(`2021-10-12 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: null,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "일반충전",
    //     minus: false,
    //     createdAt: new Date(`2021-10-01 00:30:00`),
    //     updatedAt: new Date(`2021-10-01 00:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: null,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "일반충전",
    //     minus: false,
    //     createdAt: new Date(`2021-10-01 00:30:00`),
    //     updatedAt: new Date(`2021-10-01 00:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: null,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     activityArea: null,
    //     state: "일반충전",
    //     minus: false,
    //     createdAt: new Date(`2021-10-02 00:30:00`),
    //     updatedAt: new Date(`2021-10-02 00:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     actionUserName: "홍길동",
    //     gMoney: 900,
    //     state: "송금",
    //     minus: true,
    //     createdAt: new Date(`2021-10-31 23:30:00`),
    //     updatedAt: new Date(`2021-10-31 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 1,
    //     toUserId: 288,
    //     gMoney: 900,
    //     state: "입금",
    //     minus: false,
    //     createdAt: new Date(`2021-10-31 23:30:00`),
    //     updatedAt: new Date(`2021-10-31 23:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: null,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     state: "약정충전",
    //     minus: false,
    //     createdAt: new Date(`2021-11-01 00:30:00`),
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     state: "결제완료",
    //     minus: true,
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 87,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     state: "결제완료",
    //     minus: true,
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 73,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     state: "결제",
    //     minus: true,
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 73,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     state: "결제",
    //     minus: true,
    // });
    // await transaction.create({
    //     userId: 288,
    //     storeId: 73,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     state: "결제",
    //     minus: true,
    // });
    // await transaction.create({
    //     userId: 222,
    //     storeId: 73,
    //     price: 1000,
    //     gMoney: 900,
    //     useGpoint: 100,
    //     couponData: "",
    //     state: "결제",
    //     minus: true,
    // });
    // await transaction.create({
    //     userId: 288,
    //     actionUserName: "홍길동",
    //     gMoney: 400,
    //     state: "송금",
    //     minus: true,
    // });
    // await transaction.create({
    //     userId: 1,
    //     actionUserName: "윤현수",
    //     gMoney: 400,
    //     state: "입금",
    //     minus: false,
    // });
    // await transaction.create({
    //     userId: 1,
    //     actionUserName: "윤현수",
    //     gMoney: 200,
    //     state: "송금",
    //     minus: true,
    // });
    // await transaction.create({
    //     userId: 288,
    //     actionUserName: "홍길동",
    //     gMoney: 200,
    //     state: "입금",
    //     minus: false,
    // });
    // await storeQuestion.create({
    //     storeId: 87,
    //     title: "안녕하세요",
    //     state: "정산문의",
    //     content: "정산이 잘못된것 같아요",
    // });
    // await storeQuestion.create({
    //     storeId: 87,
    //     title: "결제가...",
    //     state: "결제문의",
    //     content: "결제가 안되여",
    // });
    // await storeQuestion.create({
    //     storeId: 87,
    //     title: "아무것도 안되여",
    //     state: "기타",
    //     content: "아무것도 못해요",
    //     isAnswer: true,
    // });
    // await storeAnswer.create({
    //     storeQuestionId: 3,
    //     title: "그럴리가요",
    //     content: "아무것도 못해요/n거짓말 하지마세요",
    // });
};
