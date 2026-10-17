"use client";

import { create } from "zustand";
import { mockInstitutes, InstituteData } from "@/lib/mock-data";

interface InstituteState {
  selectedInstituteId: string; // "all" | "inst-1" | "inst-2" | "inst-3"
  selectedInstitute: InstituteData | null;
  setSelectedInstituteId: (id: string) => void;
}

export const useInstituteStore = create<InstituteState>((set) => ({
  selectedInstituteId: "all",
  selectedInstitute: null,
  setSelectedInstituteId: (id: string) => {
    const inst = mockInstitutes.find((i) => i.id === id) || null;
    set({
      selectedInstituteId: id,
      selectedInstitute: inst,
    });
  },
}));
