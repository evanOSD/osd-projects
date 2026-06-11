// src/lib/utils.ts

// Perhatikan: clsx ditaruh di luar kurung kurawal (karena dia default export)
import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
