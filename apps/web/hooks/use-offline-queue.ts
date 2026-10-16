"use client";

import { useEffect } from "react";
import { useOfflineStore } from "@/stores/offline-store";

export function useOfflineQueue() {
  const { scans, addScan, markSynced, isOnline, setOnline, getPendingScans } =
    useOfflineStore();

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline]);

  const recordScan = (studentId: string, classId: string) => {
    addScan({
      student_id: studentId,
      class_id: classId,
      timestamp: new Date().toISOString(),
    });
  };

  const syncPendingScans = async () => {
    if (!isOnline) return;

    const pending = getPendingScans();
    for (const scan of pending) {
      try {
        // TODO: POST to API
        // await api.post("/attendance/sync", scan);
        markSynced(scan.id);
      } catch (error) {
        console.error("Failed to sync scan:", error);
      }
    }
  };

  useEffect(() => {
    if (isOnline) {
      syncPendingScans();
    }
  }, [isOnline]);

  return {
    scans,
    isOnline,
    recordScan,
    pendingCount: getPendingScans().length,
  };
}
