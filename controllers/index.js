//user
const user = require("./user/user");
const pay = require("./user/pay");
const gMoney = require("./user/gMoney");
const ask = require("./user/ask");

//store
const storeHandler = require("./land/storeHandler");

//admin
const answer = require("./admin/answer");

//app
const appListData = require("./appListData");

module.exports = {
    user,
    pay,
    gMoney,
    ask,
    storeHandler,
    answer,
    appListData,
};
