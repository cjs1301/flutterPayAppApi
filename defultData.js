var moment = require("moment");
const refreshData = require("./controllers/refreshData");
const transaction = require("./models/index.js").transaction;
const axios = require("axios");
const user = require("./models/index.js").user;
const cron = require("node-cron");
const pushEvent = require("./controllers/push");
//스케줄 설정

module.exports = async () => {
    refreshData.storeListSet().then(() => {
        console.log("가게정보목록 업데이트");
    });
    cron.schedule("5 * * * *", async function () {
        // let allUser = await user.findAll({
        //     attributes: ["id", "fcmToken"],
        // });
        // allUser.forEach((element) => {
        //     // let userCoupon = await axios.get(
        //     //     `${process.env.PY_API}/app/coupon?userId=${element.id}`
        //     // );
        //     // userCoupon.data.data.active.length
        //     if (element.fcmToken) {
        //         pushEvent.dataAll();
        //     }
        // });
        pushEvent.dataAll();
    });
};
