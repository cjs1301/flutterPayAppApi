const jwt = require("jsonwebtoken");
const user = require("../../models/index").user;
require("dotenv").config();
module.exports = {
    make: (userId) => {
        console.log("userId", userId, typeof userId);
        const accessToken = jwt.sign(
            { id: userId },
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
                where: { id: accessTokenData.id },
            });
            if (userInfo) {
                console.log("userId ========", userInfo.id);
                return userInfo.id;
            } else {
                return false;
            }
        }
    },
    storeCheck: async (authorization) => {
        let accessTokenData;

        let token = authorization.split(" ")[1];
        try {
            accessTokenData = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            console.log(e)
            accessTokenData = null;
        }

        if (!accessTokenData) {
            return false;
        } else {
            console.log(accessTokenData,"token fn");
            return accessTokenData.store_id
        }
    },
};
