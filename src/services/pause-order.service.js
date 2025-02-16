import orderPauseRepo from '../repositories/pause-order.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getById = async (id) => {
    const order = await orderPauseRepo.getById(id);
    return formatResponseDates(order);
};

const create = async (data) => {
    try {
        return await orderPauseRepo.create(data);
    } catch (error) {
        throw error;
    }
};

const update = async (id, data) => {
    return await orderPauseRepo.updateById(id, data);
};

const distroy = async (id) => {
    return await orderPauseRepo.deleteById(id);
};


export default {
    getById,
    create,
    update,
    distroy,
};
