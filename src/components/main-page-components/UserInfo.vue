<template>
  <div class="user-info-parent" @click.self="showUserInfo">
    <div class="user-info" @click.self="showUserInfo">
      <div @click="showUserInfo" class="img">
        <span>{{ username?.slice(0, 2) }}</span>
      </div>

      <div @click="showUserInfo" class="info">
        <p>{{ username }}</p>
        <p>{{ email }}</p>
      </div>

      <img @click.self="userSetting" title="user setting" class="user-setting"
        src="@/assets/design-material/icons/setting.png" alt="settings">
    </div>
  </div>

  <PopUp :showPopUp="showPopUp">
    <template #title>
      Hello {{ username }}
    </template>

    <template v-slot:content>
      <p>it is a good day for achievement</p>

      <hr class="custom-hr">

      <ToDoAnalysisVue />
    </template>

    <template #button>
      <button class="close" @click="showUserInfo">Cancel</button>
    </template>
  </PopUp>

  <PopUp :showPopUp="showSettingPopUp">
    <template #title>
      Account Setting
    </template>

    <template v-slot:content>
      <p class="user-setting" @click="toggleConfirmPopup('lists')">Delete All Lists and Tasks</p>
      <p class="user-setting" @click="toggleConfirmPopup('statistics')">Delete All Statistics</p>
      <p class="user-setting" @click="toggleConfirmPopup('account')">Delete Account</p>
      <p class="user-setting" @click="logOut">Log Out</p>
    </template>

    <template #button>
      <button class="close" @click="userSetting">Cancel</button>
    </template>
  </PopUp>

  <PopUp :showPopUp="confirmPopup">
    <template #title>
      Hello {{ username }}
    </template>

    <template v-slot:content>
      <p>
        You Will Delete {{ target === 'lists' ? 'All Lists' : target === 'statistics' ? 'All Statistics' : 'Your Account' }} Permanently
      </p>
    </template>

    <template #button>
      <button v-if="target === 'lists'" class="delete" @click="deleteAllLists">ok</button>
      <button v-if="target === 'statistics'" class="delete" @click="deleteAllStatistics">ok</button>
      <button v-if="target === 'account'" class="delete" @click="deleteAccount">ok</button>
      <button class="close" @click="toggleConfirmPopup">Cancel</button>
    </template>
  </PopUp>
</template>

<script>
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'
import { allUsers } from '@/stores/allUsers.js'
import { statistics } from '@/stores/statistics.js'

import PopUp from '../global-components/PopUp.vue'
import ToDoAnalysisVue from '../user-info/ToDoAnalysis.vue'

export default {
  name: 'user-info',
  data() {
    return {
      showPopUp: false,
      showSettingPopUp: false,
      confirmPopup: false,
      target: '',
      username: '',
      email: '',
    }
  },
  beforeMount() {
    this.username = this.allUsers[0].usersCredentials[0]?.username
    this.email = this.allUsers[0].usersCredentials[0]?.email
  },
  components: {
    PopUp,
    ToDoAnalysisVue
  },
  computed: {
    ...mapState(allLists, ['returnLists']),
    ...mapWritableState(allLists, ['lists']),
    ...mapWritableState(allUsers, ['allUsers']),
    ...mapWritableState(statistics, ['statistics']),
  },
  methods: {
    showUserInfo() {
      this.showPopUp = !this.showPopUp
    },
    userSetting() {
      this.showSettingPopUp = !this.showSettingPopUp
    },
    toggleConfirmPopup(target) {
      this.showSettingPopUp = !this.showSettingPopUp
      this.confirmPopup = !this.confirmPopup
      this.target = target
    },
    logOut() {
      this.allUsers[0].idOfLoginUser = null
      localStorage.setItem("allUsers", JSON.stringify(this.allUsers));
      this.showSettingPopUp = !this.showSettingPopUp
      this.$router.push({ name: 'login' })
    },
    deleteAllLists() {
      this.lists = [
        { listName: "My Day", id: 0, listChildren: false, tasks: [] },
        { listName: "Important", id: 1, listChildren: false, tasks: [] },
        { listName: "Planned", id: 2, listChildren: false, tasks: [] },
        { listName: "Tasks", id: 3, listChildren: false, tasks: [] },
        { listName: "Search", id: 4, listChildren: false, tasks: [] }
      ]

      localStorage.setItem("allListAndTasks", JSON.stringify(this.lists));
      this.confirmPopup = !this.confirmPopup
    },
    deleteAllStatistics() {
      this.statistics = {
        allList: {
          currentList: 0,
          allList: 0
        },
        allGroupOfList: {
          currentGroupOfList: 0,
          allGroupOfList: 0
        },
        allChildList: {
          currentChildList: 0,
          allChildList: 0
        },
        allTasks: {
          currentTasks: 0,
          allTasks: 0
        },
      }

      localStorage.setItem("allListAndTasksStatistics", JSON.stringify(this.statistics));
      this.confirmPopup = !this.confirmPopup
    },
    deleteAccount() {
      this.lists = [
        { listName: "My Day", id: 0, listChildren: false, tasks: [] },
        { listName: "Important", id: 1, listChildren: false, tasks: [] },
        { listName: "Planned", id: 2, listChildren: false, tasks: [] },
        { listName: "Tasks", id: 3, listChildren: false, tasks: [] },
        { listName: "Search", id: 4, listChildren: false, tasks: [] }
      ]

      this.statistics = {
        allList: {
          currentList: 0,
          allList: 0
        },
        allGroupOfList: {
          currentGroupOfList: 0,
          allGroupOfList: 0
        },
        allChildList: {
          currentChildList: 0,
          allChildList: 0
        },
        allTasks: {
          currentTasks: 0,
          allTasks: 0
        },
      }

      this.allUsers = [
        {
          usersCredentials: [],
          numberOfUsers: 0,
          idOfLoginUser: null
        }
      ]

      localStorage.setItem("allListAndTasks", JSON.stringify(this.lists));
      localStorage.setItem("allListAndTasksStatistics", JSON.stringify(this.statistics));
      localStorage.setItem("allUsers", JSON.stringify(this.allUsers));
      this.confirmPopup = !this.confirmPopup
      this.$router.push({ name: 'login' })
    }
  },
  watch: {
    allUsers: {
      handler(newValue, oldValue) {
        this.username = this.allUsers[0].usersCredentials[0]?.username
        this.email = this.allUsers[0].usersCredentials[0]?.email
      },
      deep: true
    }
  }
}
</script>