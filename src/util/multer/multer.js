import path from "path";
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (_, file, cb) {
      cb(null, path.join(__dirname + '/../../../public/avatars/uploads'))
    },
    filename: function (_, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})
  
const upload = multer({ storage });

export default upload;