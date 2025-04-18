function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const payRequestDTO = (amount, cardToken, cardId, clientId, driverId, type, payerRole) => {
    return {
        amount,
        cardToken,
        clientId,
        driverId,
        payerRole,
        cardId,
        type,
        request: {
            amount: amount * 100, // Tiynlarda to'lov miqdori
            account: generateId(),
            terminal_id: '',
            store_id: process.env.STORE_ID ?? 8032,
            lang: 'uz'
        }
    }
}