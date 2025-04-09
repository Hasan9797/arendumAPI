import prisma from '../config/prisma.js';

const createStartPause = async (orderId) => {
    try {
        const startPause = String(Math.floor(Date.now() / 1000)); // Hozirgi vaqt soniyalarda String

        const orderPause = await prisma.orderPause.create({
            data: {
                orderId,
                startPause,
            },
        });
        return {
            startPause,
            endPause: orderPause.endPause,
            status: orderPause.status
        };
    } catch (error) {
        throw error;
    }
};

const updateEndPause = async (orderId) => {
    try {
        // 1. Oxirgi boshlangan pause ni olish
        const pause = await prisma.orderPause.findFirst({
            where: {
                orderId: orderId,
                status: true, // Status = true bo'lsa, pause hali tugamagan, agar false bo'lsa hali boshlanmagan
            },
            orderBy: {
                startPause: 'desc', // Eng oxirgi boshlangan pause
            },
        });

        if (!pause) {
            throw new Error(`Pause not found for orderId: ${orderId}`);
        }

        // 2. Hozirgi vaqtni olish (Unix timestamp soniyalarda)
        const currentUnixTimestamp = Math.floor(Date.now() / 1000); // Hozirgi vaqt soniyalarda

        // 3. totalTime = endPause - startPause
        const totalTime = currentUnixTimestamp - Number(pause.startPause);

        if (totalTime < 0) {
            throw new Error('Invalid pause time: endPause is earlier than startPause');
        }

        // 4. endPause va totalTime ni yangilash
        await prisma.orderPause.update({
            where: { id: pause.id },
            data: {
                endPause: String(currentUnixTimestamp),
                totalTime: String(totalTime),
                status: false, // Pause tugadi
            },
        });

        return {
            endPause: currentUnixTimestamp,
            totalTime,
        };
    } catch (error) {
        throw error;
    }
}

export default {
    createStartPause,
    updateEndPause
};
