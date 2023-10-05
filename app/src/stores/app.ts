import {defineStore} from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    _rightDrawerOpen: false,
    _token: '',
    _tokenExpiration: 0,
  }),
  getters: {
    getRightDrawerOpen: (state) => state._rightDrawerOpen,
    getToken: (state) => state._tokenExpiration > Date.now() ? state._token : ''
  },
  actions: {
    toggleDrawer() {
      this._rightDrawerOpen = !this._rightDrawerOpen
    },
    setToken(token: string) {
      this._token = token
      // 1 hour
      this._tokenExpiration = Date.now() + 3600000
    }
  },
  persist: true,
})
