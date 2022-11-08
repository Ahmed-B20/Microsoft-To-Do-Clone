import { defineStore } from 'pinia'

export const toggleAside = defineStore('toggleAside', {
  state: () => {
    return { 
        toggleState: true
    }
  },
  getters: {
    returnState(state) {
     return state.toggleState
    },
  },
})