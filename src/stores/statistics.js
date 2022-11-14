import { defineStore } from 'pinia'

export const statistics = defineStore('statistics', {
  state: () => {
    return { 
        statistics: JSON.parse(localStorage.getItem('allListAndTasksStatistics')) ||{
          allList: {
            currentList:0,
            allList: 0
          },
          allGroupOfList:{
            currentGroupOfList:0,
            allGroupOfList:0
          },
          allChildList:{
            currentChildList:0,
            allChildList:0
          },
          allTasks:{
            currentTasks: 0,
            allTasks:0
          },
        }
    }
  },
  getters: {
    returnStatistics(state) {
     return state.statistics
    },
  },
})