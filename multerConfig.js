const multer = require("multer");
const path = require("path");
const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    },
});
//todo 파일을 삭제 할수있는 플로우 작성
const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error("Please upload a Image"));
        }
        cb(undefined, true);
    },
});

module.exports = { imageUpload };