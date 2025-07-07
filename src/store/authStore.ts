
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      
      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          set({ user: session?.user || null, loading: false });
          
          // Listen for auth changes
          supabase.auth.onAuthStateChange((event, session) => {
            set({ user: session?.user || null, loading: false });
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ loading: false });
        }
      },
      
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            return { error: error.message };
          }
          
          set({ user: data.user });
          return {};
        } catch (error) {
          return { error: 'An unexpected error occurred' };
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name,
              },
            },
          });
          
          if (error) {
            return { error: error.message };
          }
          
          set({ user: data.user });
          return {};
        } catch (error) {
          return { error: 'An unexpected error occurred' };
        }
      },
      
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
