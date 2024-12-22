import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function handleFetchError(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    return String(error)
}
