import { create } from "zustand";

export enum NavigationArea {
    HOME,
    BOTS,
    LOGS
}

export interface NavigationStore {
    activeArea: NavigationArea
    setActiveArea: (area: NavigationArea) => void
}

/**
 * A zustand store for keeping track of where we are in the application
 */
export const useNavigationStore = create<NavigationStore>()((set) => ({
        activeArea: NavigationArea.HOME,
        setActiveArea: (area: NavigationArea) => set((state) => ({...state, activeArea: area}))
    })
);