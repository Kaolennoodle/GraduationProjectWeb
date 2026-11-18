import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    token: (state) => state.user?.token ?? '',
    userId: (state) => state.user?.uid ?? null,
    userType: (state) => state.user?.utype ?? null,
  },
  actions: {
    setUser(user: User) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    loadFromStorage() {
      const raw = localStorage.getItem('user')
      if (raw) {
        try {
          const user = JSON.parse(raw)
          if (user?.token && Number.isInteger(user.uid) && [1, 2, 3, 4].includes(user.utype)) {
            this.user = user
          } else {
            this.logout()
          }
        } catch {
          this.logout()
        }
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
  },
})
