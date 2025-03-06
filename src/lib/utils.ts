
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateRange } from "react-day-picker"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function isDateInRange(date: Date, range: DateRange | null): boolean {
  if (!range) return true;
  if (!range.from) return true;
  
  const startDate = range.from;
  const endDate = range.to || range.from;
  
  return date >= startDate && date <= endDate;
}
