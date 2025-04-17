function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const payRequestDTO = (amount, cardToken, cardId, clientId, driverId, type) => {
    return {
        amount,
        account: generateId(),
        cardToken,
        clientId,
        driverId,
        cardId,
        type,
        request: {
            amount: amount * 100, // Tiynlarda to'lov miqdori
            terminalId: '',
            storeId: process.env.STORE_ID ?? 8032,
            lang: 'uz'
        }
    }
}