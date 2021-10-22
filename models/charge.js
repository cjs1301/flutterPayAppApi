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
            state: DataTypes.STRING,
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
