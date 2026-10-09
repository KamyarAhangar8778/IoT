"use client";

import { useState, useEffect, useCallback } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { fetchPinsFromCloudflare } from "@/features/iot/services/cloudflareService";

/**
 * این hook وضعیت mount و همگام‌سازی استعلامی پین‌ها از کلادفلر را مدیریت می‌کند.
 */
export function useCloudflareQuery() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const refetchIot = useCallback(async () => {
    try {
      const segments = useIoTStore.getState().segments;
      if (segments && segments.length > 0) {
        const livePins = await fetchPinsFromCloudflare(segments);
        if (livePins && Object.keys(livePins).length > 0) {
          useIoTStore.getState().setPinsState((prev) => ({ ...prev, ...livePins }));
        }
      }
    } catch (e) {
      console.warn("Failed to refetch pin states from Cloudflare:", e);
    }
  }, []);

  return {
    mounted,
    refetchIot,
  };
}
