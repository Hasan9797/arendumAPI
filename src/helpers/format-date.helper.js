import moment from 'moment-timezone';

export const formatResponseDates = (data) => {
  try {
    // 1. Vaqtni Toshkent vaqtiga moslashtirish va formatlash
    const formatDate = (date) =>
      date instanceof Date
        ? moment(date).tz('Asia/Tashkent').format('YYYY-MM-DD HH:mm:ss')
        : date;

    // 2. Rekursiv ravishda barcha `Date` maydonlarini formatlash
    const formatObjectDates = (obj) => {
      if (!obj || typeof obj !== 'object') return obj; // Agar obj null yoki primitive bo‘lsa, qaytarish

      for (const key in obj) {
        if (obj[key] instanceof Date) {
          obj[key] = formatDate(obj[key]); // Vaqt maydonini Toshkent vaqtiga o‘tkazish
        } else if (Array.isArray(obj[key])) {
          obj[key] = obj[key].map((item) => formatObjectDates(item)); // Massiv ichidagi obyektlarni tekshirish
        } else if (typeof obj[key] === 'object') {
          obj[key] = formatObjectDates(obj[key]); // Ichki obyektlarni rekursiv tekshirish
        }
      }

      return obj;
    };

    // 3. Agar `data` massiv bo‘lsa, barcha elementlarni formatlash
    if (Array.isArray(data)) {
      return data.map((item) => formatObjectDates(item));
    }

    // 4. Agar `data` obyekt bo‘lsa, uni formatlash
    if (data && typeof data === 'object') {
      return formatObjectDates(data);
    }

    return data; // Agar `data` null yoki primitive bo‘lsa, hech narsa o‘zgarmaydi
  } catch (error) {
    console.error('Error formatting dates:', error);
    throw error;
  }
};
