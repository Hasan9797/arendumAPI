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
        let startDate = value.split('_')[0];
        let endDate = value.split('_')[1];

        if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
          startDate = moment(startDate)
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss');

          endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        } else {
          throw new Error(
            `Invalid date format for 'between' operator: ${value}`
          );
        }

        where[column] = { gte: startDate, lte: endDate };
      } else if (operator === 'contains') {
        where[column] = { contains: String(value), mode: 'insensitive' }; // Matn qidirish
      } else if (operator === 'equals') {
        where[column] = { equals: value }; // Aniq tenglik
      } else if (operator === 'gt') {
        where[column] = { gt: value }; // Katta
      } else if (operator === 'gte') {
        where[column] = { gte: value }; // Katta teng
      } else if (operator === 'lt') {
        where[column] = { lt: value }; // Kichik
      } else if (operator === 'lte') {
        where[column] = { lte: value }; // Kichik teng
      } else {
        where[column] = value;
      }
    });

    return where;
  } catch (error) {
    throw error;
  }
};
