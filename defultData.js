var moment = require("moment");
const refreshData = require("./controllers/refreshData");
const transaction = require("./models/index.js").transaction;

module.exports = async () => {
    refreshData.storeListSet().then(() => {
        console.log("가게정보목록 업데이트");
    });
    
    console.log("momentJs", moment());
};
