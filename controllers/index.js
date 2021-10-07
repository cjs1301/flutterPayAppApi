//user
const user = require("./user/user");
const pay = require("./user/pay");
const gMoney = require("./user/gMoney");
const question = require("./user/question");

//store
const storeHandler = require("./store/storeHandler");

//admin
const answer = require("./admin/gMoneyHandler");
const eventHandler = require("./admin/eventHandler");
const notice = require("./admin/notice");
const appHandler = require("./admin/appHandler");
const gMoneyHandler = require("./admin/gMoneyHandler");

//app
const appListData = require("./appListData");

module.exports = {
    user,
    pay,
    gMoney,
    question,
    storeHandler,
    answer,
    appListData,
    eventHandler,
    notice,
    appHandler,
    gMoneyHandler,
};
