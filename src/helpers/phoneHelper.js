export const normalizePhoneNumber = (input) => {
    const allowedCountryCodes = ['998', '7']; // Ruxsat berilgan davlat kodlari

    // + bo'lmasa, boshiga qo'shamiz
    if (!input.startsWith('+')) {
        input = '+' + input;
    }

    // Faqat + va raqamlarni qoldiramiz
    const cleaned = '+' + input.replace(/[^\d]/g, '');

    // Ruxsat etilgan country code bilan boshlanishini tekshiramiz
    const matchedCode = allowedCountryCodes.find(code => cleaned.startsWith('+' + code));

    if (!matchedCode) {
        return false; //throw new Error('❌ Telefon raqami ruxsat berilgan davlat kodi bilan boshlanishi kerak');
    }

    const withoutPlus = cleaned.slice(1); // "+" belgisini olib tashlaymiz
    const totalDigits = withoutPlus.length;
    const numberPart = withoutPlus.slice(matchedCode.length);

    if (!/^\d+$/.test(numberPart)) {
        return false; //throw new Error('❌ Telefon raqami faqat raqamlardan iborat bo‘lishi kerak');
    }

    // Umumiy uzunlik minimal bo'lishi kerak (masalan: +998xxxxxxxxx → 12+ belgidan kam bo'lmasligi mumkin)
    if (totalDigits < matchedCode.length + 7) {
        return false; //throw new Error('❌ Telefon raqami to‘liq emas');
    }

    return true; // ✅ Valid bo‘lsa, tozalangan formatni qaytaradi
}