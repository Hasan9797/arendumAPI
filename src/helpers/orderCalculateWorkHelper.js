import machinePriceService from '../services/machinePrice.service.js';

// Sekundlarni soat va daqiqaga aylantirish
const secondsToHoursMinutes = (seconds) => ({
  hours: Math.floor(seconds / 3600),
  minutes: Math.floor((seconds % 3600) / 60),
});

// Daqiqalarni hh:mm:ss formatiga aylantirish
const formatTime = (minutes) => {
  const totalSeconds = Math.max(0, minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Faqat kutish vaqti va narxini hisoblash
async function calculateWaitingAmountAndTime(order) {
  if (!order?.machineId) {
    throw new Error('Mashina ID talab qilinadi');
  }

  const machinePrice = await machinePriceService.getPriceByMachineId(order.machineId);
  if (!machinePrice) {
    return { waitingPaid: 0, waitingTime: 0 };
  }

  // Kutish parametrlarni olish
  const { waitingTime = 0, waitingPaid = 0 } = (machinePrice.machinePriceParams ?? []).reduce(
    (acc, param) => {
      if (param.type === 'waiting_time') acc.waitingTime = Number(param.parameter ?? 0);
      if (param.type === 'waiting_amount') acc.waitingPaid = Number(param.parameter ?? 0);
      return acc;
    },
    {}
  );

  // Kutish vaqtini hisoblash (daqiqalarda)
  const driverArrivedTime = Number(order.driverArrivedTime) || 0;
  const startHour = Number(order.startHour) || 0;
  const calculateTime = Math.floor((driverArrivedTime - startHour) / 60); // minutes
  const finalWaitingTime = calculateTime > waitingTime ? calculateTime : 0;

  return {
    waitingPaid: finalWaitingTime > 0 ? waitingPaid * finalWaitingTime : 0,
    waitingTime: finalWaitingTime,
  };
}

// Vaqt asosidagi narxni hisoblash
async function calculateWorkTimeAmount(order) {
  if (!order?.startHour || !order?.endHour || !order?.amount) {
    throw new Error('Start time, end time, and price required');
  }

  // Total pauza vaqtini hisoblash (sekundlarda)
  const totalPauseTimeInSeconds = (order.orderPause ?? []).reduce(
    (total, pause) => total + (Number(pause.totalTime) || 0),
    0
  );

  // Total ish vaqtini hisoblash (sekundlarda)
  const startHour = Number(order.startHour);
  const endHour = Number(order.endHour);
  const totalWorkInSeconds = Math.max(0, endHour - startHour - totalPauseTimeInSeconds);

  // Kutish vaqti va narxini olish
  const { waitingPaid, waitingTime } = await calculateWaitingAmountAndTime(order);

  // Minimal vaqtni hisobga olish
  const machinePrice = await machinePriceService.getPriceByMachineId(order.machineId);
  const minimumSeconds = (machinePrice?.minimum ?? 0) * 3600;
  const effectiveWorkSeconds = Math.max(totalWorkInSeconds, minimumSeconds);
  const { hours: totalWorkHour, minutes: totalWorkMinut } = secondsToHoursMinutes(effectiveWorkSeconds);

  // Pauza vaqtini soat va daqiqaga aylantirish
  const { hours: totalPauseHour, minutes: totalPauseMinut } = secondsToHoursMinutes(totalPauseTimeInSeconds);

  // Umumiy narxni hisoblash
  const amountPerMinute = order.amount / 60;
  const totalAmount = Math.round(
    (totalWorkHour * 60 + totalWorkMinut) * amountPerMinute + waitingPaid
  );

  return {
    totalWorkHour,
    totalWorkMinut,
    totalPauseHour,
    totalPauseMinut,
    totalAmount,
    paidWaitingAmount: waitingPaid,
    paidWaitingTime: formatTime(waitingTime),
  };
}

// Masofa asosidagi narxni hisoblash
async function calculateWorkKmAmount(order) {
  if (!order?.amount || !order?.kmCount) {
    throw new Error('Narx va masofa talab qilinadi');
  }

  const { waitingPaid, waitingTime } = await calculateWaitingAmountAndTime(order);
  const totalWaitingAmount = waitingPaid;
  const totalAmount = Math.round(order.amount * order.kmCount + totalWaitingAmount);

  return {
    totalAmount,
    paidWaitingAmount: waitingPaid,
    paidWaitingTime: formatTime(waitingTime),
  };
}

export default { calculateWorkTimeAmount, calculateWorkKmAmount };