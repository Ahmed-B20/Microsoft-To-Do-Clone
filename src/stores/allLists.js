import { defineStore } from 'pinia'

export const allLists = defineStore('allLists', {
  state: () => {
    return { 
        lists: JSON.parse(localStorage.getItem('allListAndTasks')) || [],
        smartList: JSON.parse(localStorage.getItem('allSmartLists')) || {
          myDay: {
            tasks: []
          },
          important: {
            tasks: []
          },
          planned: {
            tasks: []
          },
          tasks: {
            tasks: []
          },
          complete: {
            tasks: []
          },
          all: {
            tasks: []
          }
        }
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