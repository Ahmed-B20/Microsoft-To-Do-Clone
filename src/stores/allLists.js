import { defineStore } from 'pinia'

export const allLists = defineStore('allLists', {
  state: () => {
    return { 
        lists: JSON.parse(localStorage.getItem('allListAndTasks')) || []
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  getters: {
    returnLists(state) {
     return state.lists
    },
  },
})