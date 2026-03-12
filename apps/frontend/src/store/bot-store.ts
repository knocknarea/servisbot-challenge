import { PageQuery } from "@servisbot/model";
import { create } from "zustand";

const DEFAULT_PAGE_SIZE = 10;

export interface WorkerListData {
    query: PageQuery;
    completed: boolean;
    activeWorkerId?: string;
}

export interface BotListData {
    query: PageQuery;
    completed: boolean;
    activeBotId?: string;
    //
    // A per bot id (keyed on bot id) map of how we
    // are keeping track of listing workers under
    // each individual bot item in the list.
    // This will be lazily compiled.
    //
    workerMap: Map<string, WorkerListData>;
    //
    // Note we are not really storing bot state here, this
    // would be a duplication as Tanstack Query is a 'sort of'
    // store also.
    //
}
/**
 * A zustand store for managing the presentation of bot data.
 *
 * @export
 * @interface BotStore
 */
export interface BotStore extends BotListData {

    reset: () => void;

    setQuery: (q: PageQuery) => void;

    addWorker: (botId: string, workerInfo: WorkerListData) => void;

    setActiveBotId: (botId?: string) => void;

    setActiveWorkerId: (botId: string, workerId?: string) => void;

}

const initialState: BotListData = {
    query: { pageNumber: 0, pageSize: DEFAULT_PAGE_SIZE },
    completed: false,
    workerMap: new Map([] as [string, WorkerListData][])
}

export const useBotStore = create<BotStore>()((set) => ({
        ...initialState,
        reset: () => set((state) => ({...initialState })),
        setQuery: (query: PageQuery) => set((state) => ({...state, query})),
        addWorker: (botId: string, workerInfo: WorkerListData) => set((state) => {
            if(!state.workerMap.has(botId)) {
                const next = new Map(state.workerMap);
                next.set(botId, workerInfo);
                return { ...state, workerMap: next };
            }
            return state;
        }),
        setActiveBotId: (botId?: string) => set((state) => ({...state, activeBotId: botId})),
        setActiveWorkerId: (botId: string, workerId?: string) => set((state) => {
            const next = new Map(state.workerMap || new Map([] as [string, WorkerListData][]));
            const worker = next.get(botId);
            if(worker) {
                worker.activeWorkerId = workerId;
            }
            return { ...state, workerMap: next };
        }),
    })
);