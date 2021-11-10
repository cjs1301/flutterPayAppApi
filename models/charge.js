"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class charge extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
            this.belongsTo(db.user, { foreignKey: "userId", sourceKey: "id" });
        }
    }
    charge.init(
        {
            userId: DataTypes.INTEGER,
            userName: DataTypes.STRING,
            money: DataTypes.INTEGER,
            phoneNumber: DataTypes.STRING,
            email: DataTypes.STRING,
            state: {
                type: DataTypes.STRING,
                comment: "충전신청,입금미완료,충전완료,입금완료",
            },
            isShow: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelname: "charge",
        }
    );
    return charge;
};

// {
//     hooks:{
//         afterCreate:(charge,options) =>{
//             if(charge.state = '충전신청'){

//             }
//         }
//     }
// },
