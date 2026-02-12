import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvatar(name: string, gender: "MALE" | "FEMALE") {
  const username = name.replace(/\s+/g, "").toLowerCase();
  const base = "https://avatar.iran.liara.run/public";
  if (gender === "FEMALE") return `${base}/girl?username=${username}`;
  // default to boy
  return `${base}/boy?username=${username}`;
}

// 🇧🇩 phone formatting function for Bangladesh numbers
export const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  // keep digits only
  let phoneNumber = value.replace(/[^\d]/g, "");

  // convert 8801XXXXXXXXX → 01XXXXXXXXX (normalize)
  if (phoneNumber.startsWith("880")) {
    phoneNumber = "0" + phoneNumber.slice(3);
  }

  const len = phoneNumber.length;

  // typing stage formatting
  if (len <= 5) return phoneNumber;

  if (len <= 11) {
    // 01XXX-XXXXXX
    return `${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5, 11)}`;
  }

  // fallback if extra digits
  return `${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5, 11)}`;
};

export const getNext5Days = () => {
  const dates = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (let i = 0; i < 5; i++) {
    const date = new Date(tomorrow);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

export const getAvailableTimeSlots = () => {
  return [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];
};
