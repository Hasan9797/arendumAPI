// middleware/errorHandler.js
const errorHandler = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    const isDev = process.env.NODE_ENV === 'dev'; // Development muhitini tekshirish

    // Stack trace’dan fayl va qatorni olish
    const stack = error.stack || '';
    let file = 'Unknown';
    let line = 'Unknown';

    if (stack) {
        const stackLines = stack.split('\n');
        if (stackLines[1]) {
            const match = stackLines[1].match(/at .+ \((.+):(\d+):(\d+)\)/) || stackLines[1].match(/at (.+):(\d+):(\d+)/);
            if (match) {
                file = match[1]; // Fayl nomi
                line = match[2]; // Qator raqami
            }
        }
    }

    // Log qilish (stack bilan)
    console.error(`[${req.method}] ${req.path} - ${status}: ${message}\nStack: ${stack}`);

    // Javobni shakllantirish
    const response = {
        success: false,
        status,
        message,
    };

    // Development’da qo‘shimcha ma’lumot qo‘shish
    if (isDev) {
        response.file = file;
        response.line = line;
        response.stack = stack; // To‘liq stack trace (ixtiyoriy)
    }

    res.status(status).json(response);
};

export default errorHandler;