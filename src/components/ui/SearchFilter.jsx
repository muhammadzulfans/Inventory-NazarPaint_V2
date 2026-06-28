const SearchFilter = ({ leftIcon, label, value, rightIcon, isInput, onChange , className="" }) => {
    return (
        <div className={`flex items-center justify-between bg-gray-200 px-8 py-4 rounded-2xl ${className}`}>
            <div className="flex items-center gap-8 text-lg font-inter font-normal text-black w-full">
                {leftIcon}
                {isInput ? (
                    <input
                        type="text"
                        placeholder={label}
                        value={value}
                        onChange={onChange}
                        className="bg-transparent outline-none w-full"
                    />
                ) : (
                    <span>{label}</span>
                )}
            </div>
            {rightIcon}
        </div>
    );
};

export default SearchFilter;
