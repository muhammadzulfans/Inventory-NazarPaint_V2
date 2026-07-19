import * as LucideIcons from "lucide-react";
import { Package } from "lucide-react"; // fallback icon kalau nama icon invalid/kosong

const ProductVisual = ({ product, size = 40, className = "" }) => {
    const isAccessories = (product?.type || "").toUpperCase() === "ACCESSORIES";

    if (isAccessories) {
        const IconComponent = product?.icon ? LucideIcons[product.icon] : null;
        const Icon = IconComponent || Package; // fallback kalau nama icon gak ketemu di lucide-react

        // Icon punya ukuran minimum 16px, box minimum icon+8px padding —
        // biar tetap kebaca walau dipasang di tempat yang size dot-nya kecil (12px)
        const iconSize = Math.max(16, Math.round(size * 0.5));
        const boxSize = Math.max(size, iconSize + 8);

        return (
            <div
                className={`flex-shrink-0 flex items-center justify-center bg-gray-100 ${className}`}
                style={{ width: boxSize, height: boxSize }}
            >
                <Icon size={iconSize} className="text-gray-700" />
            </div>
        );
    }

    // Tipe non-ACCESSORIES: dot/kotak hexColor, TIDAK diubah dari style sebelumnya
    return (
        <div
            className={`flex-shrink-0 ${className}`}
            style={{ width: size, height: size, backgroundColor: product?.hexColor }}
        />
    );
};

export default ProductVisual;