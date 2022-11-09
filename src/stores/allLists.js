import { defineStore } from 'pinia'

export const allLists = defineStore('allLists', {
  state: () => {
    return { 
        lists: JSON.parse(localStorage.getItem('allListAndTasks')) || [
          {listName: "My Day", id: 0, listChildren: false, tasks: []},
          {listName: "Important", id: 1, listChildren: false, tasks: []},
          {listName: "Planned", id: 2, listChildren: false, tasks: []},
          {listName: "Tasks", id: 3, listChildren: false, tasks: []}
        ],
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
  getters: {
    returnLists(state) {
     return state.lists
    },
  },
})