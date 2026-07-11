export const getColorHexByCode = (code, type) => {
    if (type === "ACCESSORIES" || type === "AKSESORIS") {
        return "#f472b6";
    }
    const colorMap = {
        "207": "#22c55e", "210": "#ef4444", "211": "#000000", "219": "#78350f",
        "309": "#f97316", "321": "#ffffff", "329": "#eab308", "331": "#16a34a",
        "5100": "#15803d", "512": "#111827", "311": "#3b82f6",
    };
    return colorMap[code] || "#9ca3af";
};