import { create } from "zustand";
import type { TourStepId } from "@/lib/tour-config";

interface TourStore {
  active: boolean;
  step: TourStepId | 0;
  actionRunning: boolean;
  urlTypewriterToken: number;
  startTour: () => void;
  endTour: () => void;
  setStep: (step: TourStepId | 0) => void;
  advanceStep: () => void;
  setActionRunning: (running: boolean) => void;
  triggerUrlTypewriter: () => void;
}

export const useTourStore = create<TourStore>((set, get) => ({
  active: false,
  step: 0,
  actionRunning: false,
  urlTypewriterToken: 0,

  startTour: () =>
    set({ active: true, step: 1, actionRunning: false, urlTypewriterToken: 0 }),

  triggerUrlTypewriter: () =>
    set((s) => ({ urlTypewriterToken: s.urlTypewriterToken + 1 })),

  endTour: () => set({ active: false, step: 0, actionRunning: false }),

  setStep: (step) => set({ step }),

  advanceStep: () => {
    const { step } = get();
    if (step >= 4) {
      set({ active: false, step: 0, actionRunning: false });
      return;
    }
    set({ step: (step + 1) as TourStepId, actionRunning: false });
  },

  setActionRunning: (actionRunning) => set({ actionRunning }),
}));
