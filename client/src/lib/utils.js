import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const colors = [
    "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
    "bg-[#2c3e50] text-[#3498db] border-[1px] border-[#3498dbaa]",
    "bg-[#f39c12] text-[#e74c3c] border-[1px] border-[#e74c3caa]",
    "bg-[#27ae60] text-[#f1c40f] border-[1px] border-[#f1c40faa]",
    "bg-[#8e44ad] text-[#1abc9c] border-[1px] border-[#1abc9caa]",
];

export const getColor = (color) => {
    if (color >= 0 && color < colors.length) {
        return colors[color];
    }
    return colors[0];
};
