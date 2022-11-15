import { defineStore } from 'pinia'

export const allUsers = defineStore('allUsers', {
  state: () => {
    return { 
        allUsers: JSON.parse(localStorage.getItem('allUsers')) || [
          {
            usersCredentials: [],
            numberOfUsers: 0
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



