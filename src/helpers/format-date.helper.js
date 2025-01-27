export const formatResponseDates = (data) => {
  try {
    const formatDate = (date) =>
      date instanceof Date
        ? date.toISOString().slice(0, 19).replace('T', ' ') // YYYY-MM-DD HH:mm:ss
        : date;

    const formatObjectDates = (obj) => {
      for (const key in obj) {
        if (obj[key] instanceof Date) {
          obj[key] = formatDate(obj[key]);
        } else if (Array.isArray(obj[key])) {
          obj[key] = obj[key].map((item) =>
            typeof item === 'object' ? formatObjectDates(item) : item
          );
        } else if (obj[key] && typeof obj[key] === 'object') {
          obj[key] = formatObjectDates(obj[key]);
        }
      }
      return obj;
    };

    if (Array.isArray(data)) {
      return data.map((item) => formatObjectDates(item));
    } else if (data && typeof data === 'object') {
      return formatObjectDates(data);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
