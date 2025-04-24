import crypto from 'crypto';

export const generateHashCode = (machineId, params) => {
    // 1. `params`ni tartiblaymiz (key bo‘yicha)
    const normalizedParams = params
        .map(param => ({
            key: param.key,
            title: param.title,
            params: [...param.params], // sonlar tartibi saqlanadi
        }))
        .sort((a, b) => a.key.localeCompare(b.key));

    // 2. `machineId`ni qo‘shamiz
    const payload = {
        machineId,
        params: normalizedParams,
    };

    // 3. JSON ni qat’iy formatda stringga aylantirib, hash qilamiz
    const stringified = JSON.stringify(payload);
    const hash = crypto.createHash('sha256').update(stringified).digest('hex');

    return hash;
}