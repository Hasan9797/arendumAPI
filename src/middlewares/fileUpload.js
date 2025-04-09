import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadFolderPath = path.join(__dirname, '../../', 'uploads');

// Fayllarni saqlash konfiguratsiyasi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolderPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${file.originalname
      .trim()
      .replace(/\s+/g, '-')}`;
    cb(null, uniqueSuffix);
  },
});

function checkfile(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: You can only upload image files'));
  }
}

export const upload = multer({
  storage: storage,
  limits: { fileSize: 300 * 1024 * 1024 }, // Fayl hajmi limiti 300MB
  fileFilter: function (req, file, cb) {
    checkfile(file, cb);
  },
});

