const CategoryPillsOptions = ({ options, selectedValue, onSelect }) => {
    return (
        <div className="flex items-center gap-5 overflow-x-auto sm:scrollbar-none py-1">
            {options.map((type) => (
                <button
                    key={type.value}
                    onClick={() => onSelect(type.value)}
                    className={`px-5 py-2.5 rounded-full text-sm font-inter font-medium whitespace-nowrap transition-colors duration-150 ${
                        selectedValue === type.value
                            ? "bg-button text-black"
                            : "bg-white text-black"
                    }`}
                >
                    {type.label}
                </button>
            ))}
        </div>
    );
};

export default CategoryPillsOptions;