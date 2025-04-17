function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const depositRequestDTO = (amount, cardToken, type, clientId, driverId) => {
    return {
        amount,
        account: generateId(),
        cardToken,
        type,
        clientId,
        driverId
    }
}