import multer from "multer";
import __dirname from "../utils";

const multerOptions = {
    storage : multer.diskStorage({
        destination: function(req, res, cb) {
            cb(null, `${__dirname}/../public/img`);
        },
        filename: function(req, file, cb) {
            cb(null, `${file.originalname}-${Date.now()}`);
        }
    })

}

const uploader = multer(multerOptions);
export default uploader