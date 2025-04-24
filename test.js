import crypto from 'crypto';

function generateHashCode(machineId, params) {
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

const params = [
    {
        "key": "LIFT_HEIGHT",
        "title": "ВЫСОТА ПОДЪЕМА (М)",
        "params": [
            17
        ]
    },
    {
        "key": "Keloggg",
        "title": "Грузоподъемность (КГ)",
        "params": [
            200
        ]
    }
];

const params2 = [
    {
        "key": "LIFT_HEIGHT",
        "title": "ВЫСОТА ПОДЪЕМА (М)",
        "params": [
            17
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
    {
        "key": "Kelog",
        "title": "Грузоподъемность (КГ)",
        "params": [
            100
        ]
    },
];

console.log("8d747aa5dc3588b245e322978858f0062447c2b25758a575c05ccafcb030d9f3" === "8d747aa5dc3588b245e322978858f0062447c2b25758a575c05ccafcb030d9f3");


console.log('Hash: ', generateHashCode(1, params2));
