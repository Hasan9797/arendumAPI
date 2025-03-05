import pauseOrderService from '../../services/pause-order.service.js';

import {
    responseSuccess,
    responseError,
} from '../../helpers/response.helper.js';

const startPauseTime = async (req, res) => {
    const orderId = parseInt(req.query.id);
    try {
        const orderPause = await pauseOrderService.startPauseTime(orderId);
        res.status(201).json(responseSuccess(orderPause));
    } catch (error) {
        res.status(500).json(responseError(error.message, 500));
    }
}


const endPauseTime = async (req, res) => {
    const orderId = parseInt(req.query.id) ?? 0;
    try {
        await pauseOrderService.endPauseTime(orderId);
        res.status(201).json(responseSuccess());
    } catch (error) {
        res.status(500).json(responseError(error.message, 500));
    }
};

export default {
    startPauseTime,
    endPauseTime,
};
