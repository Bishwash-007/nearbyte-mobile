import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  userName: string;
  avatarId: number | null;
}

interface UserActions {
  setUserName: (name: string) => void;
  setAvatarId: (id: number) => void;
  clearUser: () => void;
}

interface UserStore extends UserState, UserActions {}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userName: '',
      avatarId: null,
      setUserName: (name: string) => set({ userName: name }),
      setAvatarId: (id: number) => set({ avatarId: id }),
      clearUser: () => set({ userName: '', avatarId: null }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => ({
        getItem: async (key: string) => {
          const value = await SecureStore.getItemAsync(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key: string, value: any) => {
          await SecureStore.setItemAsync(key, JSON.stringify(value));
        },
        removeItem: async (key: string) => {
          await SecureStore.deleteItemAsync(key);
        },
      })),
    },
  ),
);

export default useUserStore;
