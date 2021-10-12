var admin = require("firebase-admin");

var serviceAccount = require("../path/to/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = async function pushEvent(userInfo) {
    try {
        var payload = {
            data: {
                ...userInfo,
            },
        };
        return await admin.messaging().send("update!", payload);
    } catch (error) {
        console.log(error);
    }
};
