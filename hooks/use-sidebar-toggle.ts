import { create } from "zustand";

interface SidebarToggle {
  toggleCollapse: boolean;
  invokerToggleCallapse: () => void;
}

export const useSidebarToggle = create<SidebarToggle>((set, get) => ({
  toggleCollapse: false,
  invokerToggleCallapse: () => set({ toggleCollapse: !get().toggleCollapse }),
}));
