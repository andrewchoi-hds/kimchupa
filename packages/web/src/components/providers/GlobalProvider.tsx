"use client";

import { ReactNode } from "react";
import ToastContainer from "@/components/ui/Toast";

interface GlobalProviderProps {
  children: ReactNode;
}

export default function GlobalProvider({ children }: GlobalProviderProps) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
