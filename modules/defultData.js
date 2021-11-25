const refreshData = require("../controllers/refreshData");
const event = require("../models/index").event;
const cron = require("node-cron");
const moment = require("moment");
const pushEvent = require("../modules/push");
//스케줄 설정

module.exports = async () => {
    refreshData.storeListSet().then(() => {
        console.log("가게정보목록 업데이트");
    });
    cron.schedule("5 * * * *", async function () {
        pushEvent.dataAll();
    });
    cron.schedule("* 1 * * *", async function () {
        let events = await event.findAll({
            where: { delete: false },
        });
        let today = moment();
        events.forEach(async (el) => {
            if (el.startDate > today) {
                el.state = "시작전";
                await el.save();
            }
            if (el.startDate < today < el.endDate) {
                el.state = "진행중";
                await el.save();
            }
            if (el.endDate < today) {
                el.state = "종료";
                await el.save();
            }
        });
    });
};
