const SearchFilter = ({ leftIcon, label, value, rightIcon, isInput, onChange, className = "" }) => {
    return (
        <div className={`flex items-center justify-between bg-white px-5 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.1)] gap-3 ${className}`}>
            <div className="flex items-center gap-3 h-11 text-sm font-inter font-normal text-black min-w-0 flex-1">
                {/* Membungkus leftIcon agar ukuran dan warnanya konsisten seperti icon di Dropdown */}
                {leftIcon && (
                    <div className="text-gray-500 size-5 shrink-0 flex items-center justify-center">
                        {leftIcon}
                    </div>
                )}

                {isInput ? (
                    <input
                        type="text"
                        placeholder={label}
                        value={value}
                        onChange={onChange}
                        className="bg-transparent outline-none w-full truncate placeholder-gray-500"
                    />
                ) : (
                    <span className="truncate">{label}</span>
                )}
            </div>

            {/* Membungkus rightIcon agar tidak mengecil saat teks panjang */}
            {rightIcon && (
                <div className="shrink-0 flex items-center justify-center">
                    {rightIcon}
                </div>
            )}
        </div>
    );
};

export default SearchFilter;