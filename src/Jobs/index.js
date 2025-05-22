import cron from 'node-cron';
import orderDriverSearchScheduler from "./orderDriverSearchScheduler.js";

// Cron Jobs: Har 5 daqiqada bir marta ishga tushadi
cron.schedule('*/20 * * * *', async () => {
  console.log('📅 Cron ishga tushdi: orderDriverSearchScheduler');
  try {
    await orderDriverSearchScheduler();
  } catch (err) {
    console.error('❌ Cronda xatolik:', err);
  }
});