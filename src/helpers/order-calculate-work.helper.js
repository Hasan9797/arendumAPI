const calculateWorkTimeAmount = (order) => {
    const totalPauseTimeInSeconds = 0;
    const totalWorkInSeconds = 0;
    try {
        if (order.OrderPause && order.OrderPause.length > 0) {
            // 1. Agar pause bo‘lsa, jami totalTime yig‘iladi, aks holda 0
            totalPauseTimeInSeconds = order.OrderPause.reduce((total, pause) => total + (pause.totalTime || 0), 0);
        };


        // 2. Umumiy ish vaqtini hisoblash (soniyalarda)
        if (!order.startHour || !order.endHour) throw new Error('Invalid work time calculation');

        if (totalPauseTimeInSeconds > 0) {
            totalWorkInSeconds = (order.endHour - order.startHour) - totalPauseTimeInSeconds;
        }else{
            totalWorkInSeconds = order.endHour - order.startHour;
        }

        if (totalWorkInSeconds < 0) throw new Error('Invalid work time calculation');

        // 3. Soat va minutlarga aylantirish (Umumiy Ish Vaqti)
        const totalWorkHour = Math.floor(totalWorkInSeconds / 3600); // Soat
        const totalWorkMinut = Math.floor((totalWorkInSeconds % 3600) / 60); // Minut

        // 4. Soat va minutlarga aylantirish (Umumiy Pause Vaqti)
        const totalPauseHour = Math.floor(totalPauseTimeInSeconds / 3600);
        const totalPauseMinut = Math.floor((totalPauseTimeInSeconds % 3600) / 60);

        // 5. Umumiy miqdor hisoblash
        const totalAmount = 0;

        return {
            totalWorkHour,
            totalWorkMinut,
            totalPauseHour,
            totalPauseMinut,
            totalAmount
        };
    } catch (error) {
        throw error;
    }
};

const calculateWorkKmAmount = (order) => { }

export default { calculateWorkTimeAmount, calculateWorkKmAmount };