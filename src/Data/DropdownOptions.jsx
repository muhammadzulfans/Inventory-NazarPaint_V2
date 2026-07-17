export const catTypes = [
    { value: 'PRO',
        label: 'Pro'
    },
    { value: 'SUPER',
        label: 'Super'
    },
    { value: 'GLOSS',
        label: 'Gloss'
    },
    { value: 'ACCESSORIES',
        label: 'Accessories' }
    ,
];

export const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};