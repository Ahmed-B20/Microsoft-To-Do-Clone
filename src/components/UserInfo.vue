<template>
  <div class="user-info-parent" @click="showUserInfo">
    <div class="user-info">
      <div class="img">
        <span>UN</span>
      </div>

      <div class="info">
        <p>User Name</p>
        <p>mail@test.test</p>
      </div>
    </div>
  </div>

  <PopUp :showPopUp="showPopUp">
    <template #title>
      Hello User
    </template>

    <template v-slot:content>
      <p>it is a good day for achievement</p>
    </template>

    <template #button>
      <button class="close" @click="showUserInfo">Cancel</button>
    </template>
  </PopUp>
</template>

<script>
import PopUp from './PopUp.vue'
import { allLists } from '@/stores/allLists.js'
import { mapState, mapWritableState } from 'pinia'

export default {
  name: 'user-info',
  data() {
    return {
      showPopUp: false,
    }
  },
  components: {
    PopUp
  },
  computed: {
    ...mapState(allLists, ['returnLists', 'smartList']),
    ...mapWritableState(allLists, ['lists', 'smartList']),
  },
  methods: {
    showUserInfo() {
      this.showPopUp = !this.showPopUp
    }
  }
}
</script>