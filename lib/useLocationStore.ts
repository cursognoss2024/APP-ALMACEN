import { create } from "zustand";

type LocationState = {
  currentLocation: string | null;
  setLocation: (loc: string) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  setLocation: (loc) => set({ currentLocation: loc }),
}));