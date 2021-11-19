const multer = require("multer");
const path = require("path");
const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: function (req, file, cb) {
        if (req.url === "/admin/event") {
            return cb(null, "eventImg");
        } else {
            return cb(null, "files");
        }
    },
    filename: (req, file, cb) => {
        //todo 이름 저장방식 수정
        if (req.url === "admin/event") {
            cb(
                null,
                file.fieldname +
                    "_" +
                    Date.now() +
                    path.extname(file.originalname)
            );
        }
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
        fileSize: 50000000, // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|pdf|hwp)$/)) {
            // upload only png and jpg format
            return cb(new Error("Please upload a pdf or hwp"));
        }
        cb(undefined, true);
    },
});

module.exports = { imageUpload };
