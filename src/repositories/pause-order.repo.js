import prisma from '../config/prisma.js';

const create = async (orderId) => {
    try {
        const startPause = Math.floor(Date.now() / 1000); // Hozirgi vaqt soniyalarda

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

const getById = async (id) => {
    return await prisma.orderPause.findUnique({
        where: { id },
    });
};

const updateById = async (id, orderData) => {
    try {
        const updatedOrder = await prisma.orderPause.update({
            where: { id },
            data: orderData,
        });
        return updatedOrder;
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
        const totalTime = currentUnixTimestamp - pause.startPause;

        if (totalTime < 0) {
            throw new Error('Invalid pause time: endPause is earlier than startPause');
        }

        // 4. endPause va totalTime ni yangilash
        await prisma.orderPause.update({
            where: { id: pause.id },
            data: {
                endPause: currentUnixTimestamp,
                totalTime: totalTime,
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

const deleteById = async (id) => {
    try {
        return await prisma.orderPause.delete({
            where: { id },
        });
    } catch (error) {
        throw error;
    }
};

export default {
    getById,
    create,
    updateById,
    deleteById,
    updateEndPause
};
