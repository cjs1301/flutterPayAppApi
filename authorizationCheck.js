const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (authorization) {
    let accessTokenData;
    if (authorization) {
        let token = authorization.split(" ")[1];
        try {
            accessTokenData = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            accessTokenData = null;
        }
    }
    if (!accessTokenData) {
        return false;
    } else {
        return accessTokenData;
    }
};
