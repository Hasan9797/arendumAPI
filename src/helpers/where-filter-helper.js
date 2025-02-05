/**
 * `YYYY-MM-DD` formatni tekshirish (faqat `YYYY-MM-DD` bo‘lsa, true qaytaradi)
 */
const isValidDateFormat = (dateString) => {
  // const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format tekshirish
  // return regex.test(dateString) && !isNaN(new Date(dateString).getTime());
  return true;
};

/**
 * `YYYY-MM-DD` formatdagi sanani `Date` obyektiga o‘tkazish
 * @param {string} dateString - Sana (`YYYY-MM-DD`)
 * @param {boolean} endOfDay - `true` bo‘lsa, kunning oxiriga o‘tkazadi
 * @returns {Date} - `DateTime` obyektini qaytaradi (`ISO-8601` formatga mos)
 */
const parseDate = (dateString, endOfDay = false) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return endOfDay
    ? new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)) // End of day
    : new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Start of day
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
          where[column] = {
            gte: parseDate(startDate),
            lte: parseDate(endDate, true),
          };
        } else {
          throw new Error(
            `Invalid date format for 'between' operator: ${value}`
          );
        }
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
