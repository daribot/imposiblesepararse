
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      
      login: (email: string, password: string) => {
        // Simulación de autenticación
        const mockUser: User = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email
        };
        set({ user: mockUser });
      },
      
      register: (name: string, email: string, password: string) => {
        // Simulación de registro
        const mockUser: User = {
          id: Date.now().toString(),
          name,
          email
        };
        set({ user: mockUser });
      },
      
      logout: () => {
        set({ user: null });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
