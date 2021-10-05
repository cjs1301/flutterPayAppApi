const { user } = require("..");
const authCheck = require("../../authorizationCheck");

module.exports = {
    save: async (req, res) => {
        const authorization = req.headers.authorization;
        let userData = authCheck(authorization);
        if (!userData) {
            return res
                .status(403)
                .send({ data: null, message: "만료된 토큰입니다" });
        } else {
            //유저정보를 데이터베이스에 저장
        }
    },
};
