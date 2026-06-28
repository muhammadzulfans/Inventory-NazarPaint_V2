const Card = ({ title, value, icon }) => {
    return (
        <div className="bg-card rounded-md p-4 items-center flex justify-between shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
            <div className="space-y-3">
                <p className="text-sm text-txtNav font-inter font-semibold">
                    {title}
                </p>
                <h3 className="text-lg font-inter font-semibold text-black">
                    {value}
                </h3>
            </div>
            <div className="w-14 h-14 bg-gray-200 rounded-full my-1">
                {icon}
            </div>
        </div>
    );
};

export default Card;
