"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class store extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(db) {
            // define association here
            this.hasMany(db.transaction);
        }
    }
    store.init(
        {
            name: DataTypes.STRING,
            introduction: DataTypes.TEXT,
            address: DataTypes.STRING,
            ceo: DataTypes.STRING,
            phone: DataTypes.STRING,
            img: DataTypes.TEXT,
            logoImg: DataTypes.STRING,
            x: DataTypes.STRING,
            y: DataTypes.STRING,
            isShow: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            timestamps: false,
            sequelize,
            modelname: "store",
        }
    );
    return store;
};
