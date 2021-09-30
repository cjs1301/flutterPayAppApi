"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class storeImg extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
            this.belongsTo(db.store, {
                foreignKey: "storeId",
                sourceKey: "id",
            });
        }
    }
    storeImg.init(
        {
            storeId: DataTypes.INTEGER,
            img: DataTypes.STRING,
        },
        {
            timestamps: false,
            sequelize,
            modelname: "storeImg",
        }
    );
    return storeImg;
};
