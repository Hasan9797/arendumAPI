import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadFolderPath = path.join(__dirname, '../../', 'uploads');

// Fayl o'chirish funksiyasi
export const unlinkFile = async (file) => {
  if (!file || typeof file !== 'string') {
    console.log("Fayl nomi bo'sh yoki noto'g'ri");
    throw new Error('Fayl nomi kiritilishi shart');
  }

  const filePath = path.join(uploadFolderPath, path.basename(file));
  if (path.dirname(filePath) !== basePath) {
    console.log(`Fayl yo'li noto'g'ri: ${filePath}`);
    throw new Error("Fayl yo'li katalog chegarasidan chiqib ketdi");
  }

  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Fayl topilmadi: ${filePath}`);
    } else {
      throw new Error(`Faylni o'chirishda xatolik: ${error.message}`);
    }
  }
};
