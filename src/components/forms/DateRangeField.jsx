import React, { useState, useRef, useEffect } from "react";
import { FiCalendar, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const toISODate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const formatShort = (d) => {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return `${date.getDate()} ${MONTH_NAMES[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
};

const isSameDay = (a, b) => a && b && toISODate(a) === toISODate(b);
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const buildMonthGrid = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells = [];
    for (let i = 0; i < startWeekday; i++) {
        cells.push({
            date: new Date(year, month - 1, prevMonthDays - startWeekday + 1 + i),
            inMonth: false,
        });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ date: new Date(year, month, d), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
        const last = cells[cells.length - 1].date;
        const next = new Date(last);
        next.setDate(next.getDate() + 1);
        cells.push({ date: next, inMonth: false });
    }
    return cells;
};

const MAX_RANGE_DAYS = 31;

const DateRangeField = ({ label, value, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempStart, setTempStart] = useState(value?.startDate ? new Date(value.startDate) : null);
    const [tempEnd, setTempEnd] = useState(value?.endDate ? new Date(value.endDate) : null);
    const [showLimitInfo, setShowLimitInfo] = useState(true);

    const today = startOfDay(new Date());
    const [baseYear, setBaseYear] = useState(
        (tempStart || today).getFullYear()
    );
    const [baseMonth, setBaseMonth] = useState(
        (tempStart || today).getMonth()
    );

    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePrevMonth = () => {
        const d = new Date(baseYear, baseMonth - 1, 1);
        setBaseYear(d.getFullYear());
        setBaseMonth(d.getMonth());
    };

    const handleNextMonth = () => {
        const d = new Date(baseYear, baseMonth + 1, 1);
        setBaseYear(d.getFullYear());
        setBaseMonth(d.getMonth());
    };

    const handlePick = (date) => {
        if (date > today) return; // gak boleh pilih tanggal masa depan

        if (!tempStart || (tempStart && tempEnd)) {
            setTempStart(date);
            setTempEnd(null);
            return;
        }

        if (date < tempStart) {
            setTempStart(date);
            setTempEnd(null);
            return;
        }

        const diffDays = Math.round((date - tempStart) / 86400000) + 1;
        if (diffDays > MAX_RANGE_DAYS) {
            // Restart seleksi dari tanggal yang baru diklik
            setTempStart(date);
            setTempEnd(null);
            return;
        }
        setTempEnd(date);
    };

    const isInRange = (date) => {
        if (!tempStart || !tempEnd) return false;
        return date > tempStart && date < tempEnd;
    };

    const handleConfirm = () => {
        if (!tempStart || !tempEnd) return;
        onChange({ startDate: toISODate(tempStart), endDate: toISODate(tempEnd) });
        setIsOpen(false);
    };

    const renderMonth = (year, month) => {
        const cells = buildMonthGrid(year, month);
        return (
            <div key={`${year}-${month}`} className="mb-6">
                <p className="text-center font-inter font-semibold text-black mb-3">
                    {MONTH_NAMES[month]} {year}
                </p>
                <div className="grid grid-cols-7 text-center text-xs text-gray-400 font-inter mb-2">
                    {DAY_NAMES.map((d) => (
                        <span key={d}>{d}</span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center">
                    {cells.map(({ date, inMonth }, idx) => {
                        const disabled = date > today || !inMonth;
                        const isStart = isSameDay(date, tempStart);
                        const isEnd = isSameDay(date, tempEnd);
                        const inRange = isInRange(date);

                        return (
                            <button
                                type="button"
                                key={idx}
                                disabled={date > today}
                                onClick={() => handlePick(date)}
                                className={`h-9 w-9 mx-auto flex items-center justify-center text-sm font-inter rounded-full transition-colors
                                    ${!inMonth ? "text-gray-300" : "text-black"}
                                    ${date > today ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                                    ${isStart || isEnd ? "bg-button text-black font-semibold" : ""}
                                    ${inRange ? "bg-yellow-100 rounded-none" : ""}
                                    ${!disabled && !isStart && !isEnd && !inRange ? "hover:bg-gray-100" : ""}
                                `}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const nextMonthDate = new Date(baseYear, baseMonth + 1, 1);

    return (
        <div className={`relative font-inter ${className}`} ref={wrapperRef}>
            {label && (
                <label className="block text-xs font-bold text-button mb-1.5">
                    {label}
                </label>
            )}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between bg-white shadow-[0_4px_4px_rgba(0,0,0,0.1)] rounded-full px-5 h-11 cursor-pointer gap-3"
            >
                <span className={`text-sm truncate ${value?.startDate ? "text-black" : "text-gray-400"}`}>
                    {value?.startDate && value?.endDate
                        ? `${formatShort(value.startDate)} – ${formatShort(value.endDate)}`
                        : "Pilih rentang tanggal"}
                </span>
                <FiCalendar className="text-gray-500 size-5 shrink-0" />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-[340px] bg-white shadow-xl rounded-2xl border border-gray-100 p-5 right-0">
                    <div className="flex items-center justify-between mb-3">
                        <button type="button" onClick={handlePrevMonth} className="p-1.5 rounded-full hover:bg-gray-100">
                            <FiChevronLeft size={18} />
                        </button>
                        <span className="text-xs text-gray-400">Navigasi bulan</span>
                        <button type="button" onClick={handleNextMonth} className="p-1.5 rounded-full hover:bg-gray-100">
                            <FiChevronRight size={18} />
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto pr-1">
                        {renderMonth(baseYear, baseMonth)}
                        {renderMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth())}
                    </div>

                    {showLimitInfo && (
                        <div className="flex items-start justify-between gap-2 bg-blue-50 text-gray-500 text-xs rounded-xl p-3 mb-4">
                            <span>
                                Periode maksimal yang dapat dipilih hanya {MAX_RANGE_DAYS} hari.
                            </span>
                            <button type="button" onClick={() => setShowLimitInfo(false)}>
                                <FiX size={14} />
                            </button>
                        </div>
                    )}

                    <p className="text-center text-sm font-medium text-black mb-4">
                        {tempStart && tempEnd
                            ? `${formatShort(tempStart)} - ${formatShort(tempEnd)}`
                            : tempStart
                                ? `${formatShort(tempStart)} - ...`
                                : "Pilih tanggal mulai"}
                    </p>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!tempStart || !tempEnd}
                        className="w-full py-3 bg-button disabled:opacity-50 text-black rounded-full font-inter font-semibold text-sm transition"
                    >
                        Pilih
                    </button>
                </div>
            )}
        </div>
    );
};

export default DateRangeField;