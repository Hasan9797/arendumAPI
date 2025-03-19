import machinePriceService from '../services/machine-price.service.js';

function calculateWaitingAmountAndTime(order, totalWorkInSeconds = 0) {
  const machinePrice = machinePriceService.getPriceByMachineId(order.machineId);
  console.log('machinePrice: ', machinePrice);

  if (!machinePrice) return { waitingPaid: 0, waitingTime: 0 };

  // Parametrlarni filter va reduce bilan olish
  const { waitingTime, waitingPaid } = (
    Array.isArray(machinePrice.machinePriceParams)
      ? machinePrice.machinePriceParams
      : []
  ).reduce(
    (acc, param) => {
      if (param.type === 'waiting_time')
        acc.waitingTime = Number(param.parameter ?? 0);
      if (param.type === 'waiting_amount')
        acc.waitingPaid = Number(param.parameter ?? 0);
      return acc;
    },
    { waitingTime: 0, waitingPaid: 0 }
  );

  console.log('waitingPaid: ', waitingPaid);
  console.log('waitingTime: ', waitingTime);

  // Haydovchi kelgan vaqt va buyurtma boshlangan vaqt farqini hisoblash (daqiqalarda)
  const calculateTime = Math.floor(
    (Number(order.driverArrivedTime) - Number(order.startHour)) / 60
  );

  // Agar hisoblangan vaqt `waitingTime` dan kichik bo‘lsa, 0 bo‘lishi kerak
  const finalWaitingTime = calculateTime > waitingTime ? calculateTime : 0;
  console.log('finalWaitingTime: ', finalWaitingTime);

  if (totalWorkInSeconds > 0) {
    const minmumSeconds = machinePrice.minimum * 3600;
    console.log('minmumSeconds: ', minmumSeconds);

    // Ish vaqtini soat va minutlarga aylantirish, agar minimum vaqtdan kichik bo‘lsa, minimum vaqtga o‘tish
    let totalWorkHour = Math.floor(totalWorkInSeconds / 3600);
    let totalWorkMinut = Math.floor((totalWorkInSeconds % 3600) / 60);

    if (totalWorkInSeconds < minmumSeconds) {
      totalWorkHour = Math.floor(minmumSeconds / 3600);
      totalWorkMinut = Math.floor((minmumSeconds % 3600) / 60);
    }
    console.log(
      'totalWorkHour: ',
      totalWorkHour,
      'totalWorkMinut: ',
      totalWorkMinut
    );

    return {
      waitingPaid,
      waitingTime: finalWaitingTime,
      totalWorkHour,
      totalWorkMinut,
    };
  }

  return {
    waitingPaid,
    waitingTime: finalWaitingTime,
  };
}

// ⏳ **Vaqtni `hh:mm:ss` formatga o‘girish uchun yordamchi funksiya**
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // **Har doim 2 xonali qilish (`padStart(2, '0')`)**
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':');
};

const calculateWorkTimeAmount = (order) => {
  // 1. Total pause time hisoblash (soniyalarda)
  const totalPauseTimeInSeconds = Array.isArray(order?.OrderPause)
    ? order.OrderPause.reduce(
        (total, pause) => total + (pause.totalTime || 0),
        0
      )
    : 0;

  console.log('totalPauseTimeInSeconds: ', totalPauseTimeInSeconds);

  // 2. String Unixtimestump ni numberga o'girish (soniyalarda)
  const startHour = order.startHour ? Number(order.startHour) : 0;
  const endHour = order.endHour ? Number(order.endHour) : 0;

  console.log('startHour: ', startHour);
  console.log('endHour: ', endHour);

  // 3. Total work time hisoblash (soniyalarda)
  const totalWorkInSeconds = endHour - startHour - totalPauseTimeInSeconds;

  console.log('totalWorkInSeconds: ', totalWorkInSeconds);

  console.log('order amount: ', order.amount);

  if (totalWorkInSeconds <= 0) {
    return {
      totalWorkHour: 0,
      totalWorkMinut: 0,
      totalPauseHour: 0,
      totalPauseMinut: 0,
      totalAmount: order.amount,
      paidWaitingAmount: 0,
      paidWaitingTime: '00:00:00',
    };
  }

  let totalAmount = 0;

  const { waitingPaid, waitingTime, totalWorkHour, totalWorkMinut } =
    calculateWaitingAmountAndTime(order, totalWorkInSeconds);

  const totalWaitingAmount = waitingPaid * waitingTime;
  console.log('totalWaitingAmount: ', totalWaitingAmount);

  // 5. Pause vaqtini soat va minutlarga aylantirish
  const totalPauseHour = Math.floor(totalPauseTimeInSeconds / 3600);
  const totalPauseMinut = Math.floor((totalPauseTimeInSeconds % 3600) / 60);

  // 6. Total amount hisoblash: order.amount soatlik narx sifatida
  const amountPerMinute = order.amount / 60; // 1 minut uchun to'g'ri keladigan narx
  totalAmount = totalWorkHour * order.amount + totalWorkMinut * amountPerMinute;

  if (totalWaitingAmount > 0) totalAmount += totalWaitingAmount;
  console.log('totalAmount: ', totalAmount);

  return {
    totalWorkHour,
    totalWorkMinut,
    totalPauseHour,
    totalPauseMinut,
    totalAmount,
    paidWaitingAmount: waitingPaid,
    paidWaitingTime: formatTime(waitingTime),
  };
};

const calculateWorkKmAmount = (order) => {
  const { waitingPaid, waitingTime } = calculateWaitingAmountAndTime(order);

  const totalWaitingAmount = waitingPaid * waitingTime;

  let totalAmount = order?.amount * order?.kmCount ?? order.amount;

  if (totalWaitingAmount > 0) totalAmount += totalWaitingAmount;

  return {
    totalAmount,
    paidWaitingAmount: waitingPaid,
    paidWaitingTime: formatTime(waitingTime),
  };
};

export default { calculateWorkTimeAmount, calculateWorkKmAmount };
