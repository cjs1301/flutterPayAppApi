var admin = require("firebase-admin");

var serviceAccount = require("../path/to/serviceAccountKey.json");
const user = require("../models/index.js").user;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = {
    data: async (updateType, fcmToken) => {
        try {
            console.log(updateType, fcmToken, "체크!!!!");
            var payload = {
                data: {
                    updateUrl: updateType,
                },
                token: fcmToken,
            };
            console.log("푸쉬 알림 작동");
            return await admin.messaging().send(payload);
        } catch (error) {
            console.log(error);
        }
    },
    noti: async (message, fcmToken) => {
        try {
            let checkNoti = await user.findAll({
                where: { fcmToken: fcmToken },
                attributes: ["notiAlarm"],
            });
            if (checkNoti.notiAlarm) {
                var payload = {
                    notification: {
                        title: message.title,
                        body: message.body,
                    },
                    token: fcmToken,
                };
                console.log("푸쉬 알림 작동");
                return await admin.messaging().send(payload);
            }
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
            console.log("푸쉬 알림 작동");
            return await admin.messaging().sendMulticast(message);
        } catch (error) {
            console.log(error);
        }
    },
};
