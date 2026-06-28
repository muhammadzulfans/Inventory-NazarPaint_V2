const SidebarButton = ({
                           icon,
                           label,
                           isOpen,
                           className = "",
                           onClick,
                           isActive,
                       }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-xl transition-all duration-200
            ${isOpen
                ? "px-5 py-3 flex items-center gap-4 justify-start"
                : "py-3 flex justify-center items-center"}
            ${className}
            ${isActive
                ? "bg-button shadow-[0_4px_4px_rgba(0,0,0,0.2)] font-medium"
                : "bg-transparent font-normal"
            }
            border-none outline-none`}
        >
            <div className="text-xl shrink-0">
                {icon}
            </div>
            <span
                className={`text-lg font-inter text-black whitespace-nowrap overflow-hidden transition-all duration-300
                ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
            >
                {label}
            </span>
        </button>
    );
};
export default SidebarButton;