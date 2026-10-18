import { create } from 'zustand';

type User = { id: string; email: string } | null;
export const useAuth = create<{ user: User; setUser: (u: any) => void; signOut: () => void }>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: () => set({ user: null }),
}));
