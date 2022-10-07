import { defineStore } from 'pinia'

export const toggleAside = defineStore('toggleAside', {
  state: () => {
    return { 
        toggleState: true
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  getters: {
    returnState(state) {
     return state.toggleState
    },
  },
})