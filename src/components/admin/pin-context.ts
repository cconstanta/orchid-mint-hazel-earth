import { createContext, useContext } from "react";

export const PinCtx = createContext("");

export function useStaffPin() {
  return useContext(PinCtx);
}
