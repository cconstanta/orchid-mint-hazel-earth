const KEY = "peremena-staff-pin";

export function getStaffPin() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(KEY) ?? "";
}

export function setStaffPin(pin: string) {
  sessionStorage.setItem(KEY, pin);
}

export function clearStaffPin() {
  sessionStorage.removeItem(KEY);
}
