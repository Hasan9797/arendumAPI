const calculateWorkTimeAmount = (order) => {

    // 1. Total pause time hisoblash (soniyalarda)
    const totalPauseTimeInSeconds = Array.isArray(order?.OrderPause)
        ? order.OrderPause.reduce((total, pause) => total + (pause.totalTime || 0), 0)
        : 0;

    // 2. String Unixtimestump ni numberga o'girish (soniyalarda)
    const startHour = order.startHour ? Number(order.startHour) : 0;
    const endHour = order.endHour ? Number(order.endHour) : 0;

    // 3. Total work time hisoblash (soniyalarda)
    const totalWorkInSeconds = (endHour - startHour) - totalPauseTimeInSeconds;
    if (totalWorkInSeconds < 0) throw new Error('Invalid work time calculation');

    // 4. Ish vaqtini soat va minutlarga aylantirish
    const totalWorkHour = Math.floor(totalWorkInSeconds / 3600);
    const totalWorkMinut = Math.floor((totalWorkInSeconds % 3600) / 60);

    // 5. Pause vaqtini soat va minutlarga aylantirish
    const totalPauseHour = Math.floor(totalPauseTimeInSeconds / 3600);
    const totalPauseMinut = Math.floor((totalPauseTimeInSeconds % 3600) / 60);

    // 6. Total amount hisoblash: order.amount soatlik narx sifatida
    const amountPerMinute = order.amount / 60; // 1 minut uchun to'g'ri keladigan narx
    const totalAmount = (totalWorkHour * order.amount) + (totalWorkMinut * amountPerMinute);

    return {
        totalWorkHour,
        totalWorkMinut,
        totalPauseHour,
        totalPauseMinut,
        totalAmount
    };
};

const calculateWorkKmAmount = (order) => {
    const totalAmount = (order?.amount * order?.kmCount) ?? order.amount;
    return { totalAmount };
};

export default { calculateWorkTimeAmount, calculateWorkKmAmount };