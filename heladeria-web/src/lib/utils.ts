import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isStaff(rol?: string) {
  return rol === "ADMINISTRADOR" || rol === "CAJERO";
}
