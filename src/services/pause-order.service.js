import orderPauseRepo from '../repositories/pause-order.repo.js';

const startPauseTime = async (orderId) => {
    try {
        return await orderPauseRepo.createStartPause(orderId);
    } catch (error) {
        throw error;
    }
};

const endPauseTime = async (orderId) => {
    return await orderPauseRepo.updateEndPause(orderId);
};

export default {
    startPauseTime,
    endPauseTime,
};
