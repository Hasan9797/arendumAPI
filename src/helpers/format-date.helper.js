// import moment from 'moment-timezone';

// export const formatResponseDates = (data) => {
//   try {
//     // 1. Vaqtni Toshkent vaqtiga moslashtirish va formatlash
//     const formatDate = (date) =>
//       date instanceof Date
//         ? moment(date).tz('Asia/Tashkent').format('YYYY-MM-DD HH:mm:ss')
//         : date;

//     // 2. Rekursiv ravishda barcha `Date` maydonlarini formatlash
//     const formatObjectDates = (obj) => {
//       if (!obj || typeof obj !== 'object') return obj; // Agar obj null yoki primitive bo‘lsa, qaytarish

//       for (const key in obj) {
//         if (obj[key] instanceof Date) {
//           obj[key] = formatDate(obj[key]); // Vaqt maydonini Toshkent vaqtiga o‘tkazish
//         } else if (Array.isArray(obj[key])) {
//           obj[key] = obj[key].map((item) => formatObjectDates(item)); // Massiv ichidagi obyektlarni tekshirish
//         } else if (typeof obj[key] === 'object') {
//           obj[key] = formatObjectDates(obj[key]); // Ichki obyektlarni rekursiv tekshirish
//         }
//       }

//       return obj;
//     };

//     // 3. Agar `data` massiv bo‘lsa, barcha elementlarni formatlash
//     if (Array.isArray(data)) {
//       return data.map((item) => formatObjectDates(item));
//     }

//     // 4. Agar `data` obyekt bo‘lsa, uni formatlash
//     if (data && typeof data === 'object') {
//       return formatObjectDates(data);
//     }

//     return data; // Agar `data` null yoki primitive bo‘lsa, hech narsa o‘zgarmaydi
//   } catch (error) {
//     console.error('Error formatting dates:', error);
//     throw error;
//   }
// };

/**
 * `Date` obyektini `YYYY-MM-DD HH:mm:ss` formatga o'tkazish (Toshkent vaqti bilan)
 */
const formatDate = (date) => {
  if (!(date instanceof Date)) return date; // Agar `Date` bo‘lmasa, o‘zgartirmaslik

  // Toshkent vaqtiga o‘tkazish va formatlash
  return new Intl.DateTimeFormat('uz-UZ', {
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
    .replace(
      /(\d{2})\.(\d{2})\.(\d{4}), (\d{2}):(\d{2}):(\d{2})/,
      '$3-$2-$1 $4:$5:$6'
    );
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
