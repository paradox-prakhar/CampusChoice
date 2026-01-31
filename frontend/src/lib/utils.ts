import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (addr: string) => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const formatCurrency = (amount: string | number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    .format(Number(amount));
};
