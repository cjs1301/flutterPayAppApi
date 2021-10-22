var admin = require("firebase-admin");

var serviceAccount = require("../path/to/serviceAccountKey.json");

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
            console.log("푸쉬 알림 작동");
            return await admin.messaging().send(payload);
        } catch (error) {
            console.log(error);
        }
    },
    noti: async (content, fcmToken) => {
        try {
            var payload = {
                Notification: {
                    title: content.title,
                    body: content.body,
                },
                token: fcmToken,
            };
            console.log("푸쉬 알림 작동");
            return await admin.messaging().send(payload);
        } catch (error) {
            console.log(error);
        }
    },
    notiAll: async (updateType) => {
        try {
            var payload = {
                Notification: {
                    title: "제목(전체발송)",
                    body: "내용",
                },
            };
            console.log("푸쉬 알림 작동");
            return await admin.messaging().sendAll(payload);
        } catch (error) {
            console.log(error);
        }
    },
};
