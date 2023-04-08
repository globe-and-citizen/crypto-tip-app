import {defineStore} from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    _rightDrawerOpen: false
  }),
  getters: {
    getRightDrawerOpen: (state) => state._rightDrawerOpen
  },
  actions: {
    toggleDrawer() {
      this._rightDrawerOpen = !this._rightDrawerOpen
    }
  }
})
