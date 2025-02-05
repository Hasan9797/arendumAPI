/**
 * `Date` obyektini `YYYY-MM-DD HH:mm:ss` formatga o'tkazish (Toshkent vaqti bilan)
 */
const formatDate = (date) => {
  if (!(date instanceof Date)) return date; // Agar `Date` bo‘lmasa, o‘zgartirmaslik

  // Toshkent vaqtiga o‘tkazish va formatlash
  const tzDate = new Intl.DateTimeFormat('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Tashkent',
    hour12: false, // 24 soat formatda
  })
    .format(date)
    .replace(',', '');

  return tzDate.replace(/\//g, '-'); // `YYYY/MM/DD` ni `YYYY-MM-DD` ga almashtirish
};

/**
 * `data` ichidagi barcha `Date` maydonlarini rekursiv formatlaydigan funksiya
 */
const formatObjectDates = (obj) => {
  if (!obj || typeof obj !== 'object') return obj; // Agar primitiv bo‘lsa, o‘zgartirmaslik

  if (Array.isArray(obj)) {
    return obj.map(formatObjectDates); // Massiv bo‘lsa, har bir elementni tekshirish
  }

  const formattedObj = {};
  for (const key in obj) {
    formattedObj[key] =
      obj[key] instanceof Date
        ? formatDate(obj[key])
        : formatObjectDates(obj[key]); // `Date` yoki `object`ni tekshirish
  }
  return formattedObj;
};

/**
 * Response ma'lumotlarini formatlaydigan funksiya
 */
export const formatResponseDates = (data) => {
  try {
    return formatObjectDates(data);
  } catch (error) {
    console.error('Error formatting dates:', error);
    throw error;
  }
};
