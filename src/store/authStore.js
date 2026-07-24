import { create } from 'zustand'
import { persist } from 'zustand/middleware'


export const useAuthStore = create(
  persist(
    (set) => ({
      
      token: null,
      user: null,          
      isAuthenticated: false,

     
      login: (token, user) => set({
        token,
        user,
        isAuthenticated: true,
      }),

      logout: () => set({
        token: null,
        user: null,
        isAuthenticated: false,
      }),

      updateUser: (updatedUser) => set((state) => ({
        user: { ...state.user, ...updatedUser },
      })),
    }),
    {
      name: 'careercompass-auth',   
      partialize: (state) => ({     
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)