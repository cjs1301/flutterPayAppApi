const transaction = require("./models/index.js").transaction;
const type = require("./models/index.js").type;
var moment = require("moment");

module.exports = async () => {
    var typeList = ["일반충전", "약정충전", "송금", "결제"];
    typeList.forEach(async (item) => {
        await type.create({
            type: item,
        });
    });
    console.log("momentJs", moment());
};
