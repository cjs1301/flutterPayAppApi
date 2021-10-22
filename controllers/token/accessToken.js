const jwt = require("jsonwebtoken");
const user = require("../../models/index").user;
require("dotenv").config();
module.exports = {
    make: (userCode) => {
        console.log("userCode", userCode, typeof userCode);
        const accessToken = jwt.sign(
            { userCode: userCode },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        );
        return accessToken;
    },
    check: async (authorization) => {
        let accessTokenData;

        let token = authorization.split(" ")[1];
        try {
            accessTokenData = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            accessTokenData = null;
        }

        if (!accessTokenData) {
            return false;
        } else {
            console.log(accessTokenData);
            let userInfo = await user.findOne({
                where: { userCode: accessTokenData.userCode },
            });
            if (userInfo) {
                console.log("userId ========", userInfo.id);
                return userInfo.id;
            } else {
                return false;
            }
        }
    },
};
