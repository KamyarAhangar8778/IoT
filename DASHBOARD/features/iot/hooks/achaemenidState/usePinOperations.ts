"use client";

import { useState, useEffect, useCallback } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { isCloudflareEnabled } from "@/features/iot/services/cloudflareService";
import { initMqtt, onMqttStateChange } from "@/features/iot/services/mqttService";
import { soundManager } from "@/lib/audio";
import { syncSinglePin, syncBatchPins } from "./core/pinSyncUtils";

interface UsePinOperationsProps {
  refetchIot: () => void;
}

export function usePinOperations({ refetchIot }: UsePinOperationsProps) {
  const setPinsState = useIoTStore((state) => state.setPinsState);
  const showToast = useIoTStore((state) => state.showToast);
  const [isLoadingIoT, setIsLoadingIoT] = useState(false);

  useEffect(() => {
    initMqtt();
    const unsubscribe = onMqttStateChange((pin, state) => {
      setPinsState((prev) => ({ ...prev, [pin]: state }));
    });
    return () => unsubscribe();
  }, [setPinsState]);

  const updatePinOnServer = useCallback(async (pin: string, pinState: boolean, preventMqtt: boolean = false, timer?: number) => {
    try {
      setPinsState((prev) => ({ ...prev, [pin]: pinState }));
      const segments = useIoTStore.getState().segments;
      const segment = segments.find((s) => s.pin === pin);

      // Fire-and-forget: منتظر پاسخ HTTP کلادفلر نمی‌ماند تا تاخیر کاربر صفر شود
      void syncSinglePin(pin, pinState, preventMqtt, timer, segment?.mode === "push", showToast);
    } catch (error) {
      console.error("Failed to update pin value:", error);
    }
  }, [setPinsState, showToast]);

  const handleTogglePin = useCallback(async (pin: string) => {
    const currentState = useIoTStore.getState().pinsState[pin];
    const nextState = !currentState;
    if (nextState) soundManager.playToggleOn();
    else soundManager.playToggleOff();
    
    setPinsState((prev) => ({ ...prev, [pin]: nextState }));
    const segments = useIoTStore.getState().segments;
    const segment = segments.find((s) => s.pin === pin);
    await updatePinOnServer(pin, nextState, false, segment?.auto_off);
  }, [setPinsState, updatePinOnServer]);

  const handleSetPinState = useCallback(async (pin: string, state: boolean, preventMqtt: boolean = false) => {
    const currentState = useIoTStore.getState().pinsState[pin];
    if (state !== currentState) {
      if (state) soundManager.playToggleOn();
      else soundManager.playToggleOff();
    }
    setPinsState((prev) => ({ ...prev, [pin]: state }));
    const segments = useIoTStore.getState().segments;
    const segment = segments.find((s) => s.pin === pin);
    await updatePinOnServer(pin, state, preventMqtt, segment?.auto_off);
  }, [setPinsState, updatePinOnServer]);

  const handleBatchPinState = useCallback(async (actions: Array<{ targetPin: string; actionOn: boolean }>) => {
    try {
      let soundPlayed = false;
      const stateUpdates: Record<string, boolean> = {};
      const pinsState = useIoTStore.getState().pinsState;

      for (const action of actions) {
        if (action.actionOn !== pinsState[action.targetPin]) {
          soundPlayed = true;
        }
        stateUpdates[action.targetPin] = action.actionOn;
      }

      if (soundPlayed) soundManager.playToggleOn();

      setPinsState((prev) => ({ ...prev, ...stateUpdates }));

      const segments = useIoTStore.getState().segments;
      void syncBatchPins(actions, segments, isCloudflareEnabled(), showToast);
    } catch (error) {
      console.error("Failed to update batch pin values:", error);
    }
  }, [setPinsState, showToast]);

  return {
    isLoadingIoT,
    updatePinOnServer,
    handleTogglePin,
    handleSetPinState,
    handleBatchPinState,
  };
}
