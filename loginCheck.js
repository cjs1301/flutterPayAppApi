const authCheck = require("./authorizationCheck");
const user = require("./models/index.js").user;

module.exports = async function (authorization) {
    let authData = authCheck(authorization);
    if (!authData) {
        //실패
        return false;
    } else {
        let User = await user.findOne({
            where: { userCode: authData.userCode },
        });
        if (!User) {
            return false;
        } else {
            return User;
        }
    }
};
