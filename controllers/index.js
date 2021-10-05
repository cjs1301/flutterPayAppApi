//user
const user = require("./user/user");
const pay = require("./user/pay");
const gMoney = require("./user/gMoney");
const question = require("./user/question");

//store
const storeHandler = require("./store/storeHandler");

//admin
const answer = require("./admin/userHandler");
const event = require("./admin/event");
const notice = require("./admin/notice");
const appHandler = require("./admin/appHandler");
const userHandler = require("./admin/userHandler");

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
    event,
    notice,
    appHandler,
    userHandler,
};
