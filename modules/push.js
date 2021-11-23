var admin = require("firebase-admin");

var serviceAccount = require("../path/to/serviceAccountKey.json");
const user = require("../models/index.js").user;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = {
    data: async (updateType, fcmToken) => {
        try {
            var payload = {
                data: {
                    updateUrl: updateType,
                },
                token: fcmToken,
            };
            return await admin.messaging().send(payload);
        } catch (error) {
            console.log(error);
        }
    },
    noti: async (message, fcmToken) => {
        try {
            // let checkNoti = await user.findOne({
            //     where: { fcmToken: fcmToken },
            //     attributes: ["notiAlarm"],
            // });
            // if (checkNoti.notiAlarm) {
            var payload = {
                notification: {
                    title: message.title,
                    body: message.body,
                },
                token: fcmToken,
            };
            return await admin.messaging().send(payload);
            //}
        } catch (error) {
            console.log(error);
        }
    },
    notiAll: async (message) => {
        const registrationTokens = [];
        let checkNoti = await user.findAll({
            where: { notiAlarm: true },
            attributes: ["fcmToken"],
        });
        checkNoti.forEach((element) => {
            if (element.fcmToken !== null) {
                registrationTokens.push(element.fcmToken);
            }
        });
        try {
            var message = {
                notification: {
                    title: message.title,
                    body: message.body,
                },
                tokens: registrationTokens,
            };
            return await admin.messaging().sendMulticast(message);
        } catch (error) {
            console.log(error);
        }
    },
    dataAll: async () => {
        const registrationTokens = [];
        let checkNoti = await user.findAll({
            attributes: ["fcmToken"],
        });
        checkNoti.forEach((element) => {
            if (element.fcmToken !== null) {
                registrationTokens.push(element.fcmToken);
            }
        });
        try {
            var message = {
                data: {
                    updateUrl: "/user/info",
                },
                tokens: registrationTokens,
            };
            return await admin.messaging().sendMulticast(message);
        } catch (error) {
            console.log(error);
        }
    },
};
