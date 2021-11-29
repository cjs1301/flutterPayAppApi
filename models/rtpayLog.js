"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class rtpayLog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
        }
    }
    rtpayLog.init(
        {
            RCODE: {
                type: DataTypes.STRING,
                comment: "http 상태 코드",
            },
            RPAY: {
                type: DataTypes.STRING,
                comment: "입금된 금액",
            },
            RNAME: {
                type: DataTypes.STRING,
                comment: "입금자명",
            },
            RTEXT: {
                type: DataTypes.STRING,
                comment: "내역 메세지",
            },
            RBANK: {
                type: DataTypes.STRING,
                comment: "은행이름",
            },
            resLog: {
                type: DataTypes.STRING,
                comment: "입금받은 요청에 대한 처리 결과",
            },
        },
        {
            sequelize,
            modelname: "rtpayLog",
        }
    );
    return rtpayLog;
};
