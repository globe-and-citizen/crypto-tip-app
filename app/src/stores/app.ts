import {defineStore} from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    _rightDrawerOpen: false,
    _token: ''
  }),
  getters: {
    getRightDrawerOpen: (state) => state._rightDrawerOpen,
    getToken: (state) => state._token
  },
  actions: {
    toggleDrawer() {
      this._rightDrawerOpen = !this._rightDrawerOpen
    },
    setToken(token: string) {
      this._token = token
    }
  }
})
