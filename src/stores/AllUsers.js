import { defineStore } from 'pinia'

export const allUsers = defineStore('allUsers', {
  state: () => {
    return { 
        allUsers: JSON.parse(localStorage.getItem('allUsers')) || [
          {
            usersCredentials: [],
            numberOfUsers: 0,
            idOfLoginUser: null
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