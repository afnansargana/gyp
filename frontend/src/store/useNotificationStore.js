import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  items: [],
  unread: 0,
  push: (item) =>
    set((state) => ({
      items: [{ id: `${Date.now()}-${Math.random()}`, read: false, ...item }, ...state.items].slice(0, 30),
      unread: state.unread + 1,
    })),
  markAllRead: () =>
    set((state) => ({
      unread: 0,
      items: state.items.map((n) => ({ ...n, read: true })),
    })),
  clear: () => set({ items: [], unread: 0 }),
  latest: () => get().items[0] || null,
}));

export default useNotificationStore;
