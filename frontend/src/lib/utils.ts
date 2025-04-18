import { ParsedDataItem } from "@/lib/queries";
import { clsx, type ClassValue } from "clsx";
import { atom } from "jotai";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parsedDataAtom = atom<ParsedDataItem[]>([]);
