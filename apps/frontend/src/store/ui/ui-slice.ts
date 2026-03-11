import { create } from "zustand";

export enum NavigationArea {
    HOME,
    BOTS,
    LOGS
}

export interface UIStore {
    activeArea: NavigationArea
    setActiveArea: (area: NavigationArea) => void
}

export const useUIStore = create<UIStore>()((set) => ({
        activeArea: NavigationArea.HOME,
        setActiveArea: (area: NavigationArea) => set((state) => ({...state, activeArea: area}))
    })
);