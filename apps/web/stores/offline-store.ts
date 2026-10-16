import { create } from "zustand";

interface OfflineScan {
  id: string;
  student_id: string;
  class_id: string;
  timestamp: string;
  synced: boolean;
}

interface OfflineState {
  scans: OfflineScan[];
  isOnline: boolean;
  addScan: (scan: Omit<OfflineScan, "id" | "synced">) => void;
  markSynced: (id: string) => void;
  setOnline: (online: boolean) => void;
  getPendingScans: () => OfflineScan[];
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  scans: [],
  isOnline: typeof window !== "undefined" ? (window.navigator as any).onLine ?? true : true,
  addScan: (scan) =>
    set((state) => ({
      scans: [
        ...state.scans,
        { ...scan, id: crypto.randomUUID(), synced: false },
      ],
    })),
  markSynced: (id) =>
    set((state) => ({
      scans: state.scans.map((s) =>
        s.id === id ? { ...s, synced: true } : s
      ),
    })),
  setOnline: (online) => set({ isOnline: online }),
  getPendingScans: () => get().scans.filter((s) => !s.synced),
}));
