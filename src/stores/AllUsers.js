import { defineStore } from 'pinia'

export const allUsers = defineStore('allUsers', {
  state: () => {
    return { 
        // allUsers: JSON.parse(localStorage.getItem('allUsers')) || [
        //     {
        //         userCredentials: {
        //             userName: '',
        //             email: '',
        //             password: '',
        //             lastLogin: ''
        //         },
        //         userData: {
        //             lists: [
        //                 {listName: "My Day", id: 0, listChildren: false, tasks: []},
        //                 {listName: "Important", id: 1, listChildren: false, tasks: []},
        //                 {listName: "Planned", id: 2, listChildren: false, tasks: []},
        //                 {listName: "Tasks", id: 3, listChildren: false, tasks: []},
        //                 {listName: "Search", id: 4, listChildren: false, tasks: []}
        //               ],
        //               statistics: {
        //                 allList: {
        //                   currentList: 0,
        //                   allList: 0
        //                 },
        //                 allGroupOfList: {
        //                   currentGroupOfList: 0,
        //                   allGroupOfList: 0
        //                 },
        //                 allChildList: {
        //                   currentChildList: 0,
        //                   allChildList: 0
        //                 },
        //                 allTasks: {
        //                   currentTasks: 0,
        //                   allTasks: 0
        //                 },
        //               }
        //         }
        //     }
        // ]

        allUsers: JSON.parse(localStorage.getItem('allUsers')) || [
          {
              userCredentials: [
                {
                  id:'',
                  userName: '',
                  email: '',
                  password: '',
                  lastLogin: ''
                }
              ]
          }
      ]
    }
  },
  getters: {
    returnAllUsers(state) {
     return state.allUsers
    },
  },
})



