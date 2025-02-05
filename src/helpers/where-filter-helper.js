import moment from 'moment-timezone';

/**
 * Prisma uchun `where` obyektini quruvchi optimal funksiya.
 * Har xil ma'lumot turlarini avtomatik aniqlaydi.
 */
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
      const isNumeric = !isNaN(value); // Son ekanligini tekshirish

      if (isNumeric) value = parseInt(value);

      // 🟢 3. Operatorga qarab filter qo‘shish
      if (operator === 'between' && column === 'createdAt') {
        const [startDate, endDate] = value.split('_').map((v) => new Date(v));

        where[column] = { gte: startDate, lte: endDate };
      } else {
        where[column] = value;
      }

      // else if (operator === 'contains' && typeof value === 'string') {
      //   where[column] = { contains: value, mode: 'insensitive' }; // Matn qidirish
      // } else if (operator === 'equals') {
      //   where[column] = { equals: value }; // Aniq tenglik
      // } else if (operator === 'gt' && isNumeric) {
      //   where[column] = { gt: value }; // `>` operatori faqat sonlar uchun
      // } else if (operator === 'lt' && isNumeric) {
      //   where[column] = { lt: value }; // `<` operatori faqat sonlar uchun
      // }
    });

    return where;
  } catch (error) {
    throw error;
  }
};
