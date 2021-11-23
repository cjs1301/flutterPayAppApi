const refreshData = require("../controllers/refreshData");
const cron = require("node-cron");
const pushEvent = require("../modules/push");
//스케줄 설정

module.exports = async () => {
    refreshData.storeListSet().then(() => {
        console.log("가게정보목록 업데이트");
    });
    cron.schedule("5 * * * *", async function () {
        pushEvent.dataAll();
    });
};
