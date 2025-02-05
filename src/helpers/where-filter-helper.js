import moment from 'moment-timezone';

/**
 * Prisma uchun `where` obyektini quruvchi optimal funksiya.
 * Har xil ma'lumot turlarini avtomatik aniqlaydi.
 */

const isValidDateFormat = (dateString) => {
  return moment(dateString, 'YYYY-MM-DD', true).isValid();
};

export const buildWhereFilter = (filters, lang = 'uz') => {
  try {
    let where = {};

    filters.forEach((filter) => {
      let { column, operator, value } = filter;

      if (!column || !operator || value === undefined) return; // Noto‘g‘ri filterni o‘tkazib yuborish

      // 🟢 1. Agar `column` = "name" bo‘lsa, uni `nameUz` yoki `nameRu` ga o‘zgartirish
      if (column === 'name' && (lang === 'uz' || lang === 'ru')) {
        column = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
      }

      // 🟢 2. Data turini aniqlash va moslashtirish
      const isNumeric = !isNaN(value);

      if (isNumeric) value = parseInt(value);

      // 🟢 3. Operatorga qarab filter qo‘shish
      if (operator === 'between' && column === 'createdAt') {
        const [startDate, endDate] = value.split('_');

        if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
          where[column] = { gte: startDate, lte: endDate };
        } else {
          throw new Error(
            `Invalid date format for 'between' operator: ${value}`
          );
        }

        where[column] = { gte: startDate, lte: endDate };
      } else if (operator === 'contains' && typeof value === 'string') {
        where[column] = { contains: value, mode: 'insensitive' }; // Matn qidirish
      } else if (operator === 'equals') {
        where[column] = { equals: value }; // Aniq tenglik
      } else {
        where[column] = value;
      }
    });

    return where;
  } catch (error) {
    throw error;
  }
};
