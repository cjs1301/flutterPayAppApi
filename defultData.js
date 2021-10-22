var moment = require("moment");
const refreshData = require("./controllers/refreshData");

module.exports = async () => {
    refreshData.storeListSet().then(() => {
        console.log("가게정보목록 업데이트");
    });
    console.log("momentJs", moment());
};
