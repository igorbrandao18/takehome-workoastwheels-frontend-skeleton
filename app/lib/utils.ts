import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function combineDateAndTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const combinedDate = new Date(date);
  combinedDate.setHours(hours, minutes, 0, 0);
  return combinedDate.toISOString();
} 