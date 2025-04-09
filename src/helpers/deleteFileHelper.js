import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadFolderPath = path.join(__dirname, '../../', 'uploads');

// Fayl o'chirish funksiyasi
export const unlinkFile = (array = []) => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|svg)$/i;

  fs.readdir(uploadFolderPath, (err, files) => {
    if (err) {
      console.error(
        "Upload papkasidagi fayllarni o'qishda xatolik yuz berdi:",
        err
      );
      return;
    }

    const unlinkFiles = array.map((unlinkFile) =>
      unlinkFile.toString().slice(1)
    );

    const imageFiles = files.filter(
      (file) => imageExtensions.test(file) && unlinkFiles.includes(file)
    );

    imageFiles.forEach((file) => {
      const filePath = path.join(uploadFolderPath, file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`${file} faylini o'chirishda xatolik yuz berdi:`, err);
        } else {
          console.log(`${file} muvaffaqiyatli o'chirildi.`);
        }
      });
    });
  });
};
