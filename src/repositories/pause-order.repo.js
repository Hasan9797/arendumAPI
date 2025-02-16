import prisma from '../config/prisma.js';

const create = async (newOrder) => {
    try {
        return await prisma.orderPause.create({
            data: newOrder,
        });
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
};
