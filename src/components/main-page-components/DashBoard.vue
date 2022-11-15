<template>
  <div class="main-content" id="main-content">
    <transition name="to-right">
      <AsideBar />
    </transition>

    <TabContent />
  </div>
</template>

<script>
import AsideBar from "./AsideBar.vue";
import TabContent from "./TabContent.vue";

import { toggleAside } from '@/stores/toggleAside.js'
import { mapState, mapWritableState } from 'pinia'
import { allLists } from '@/stores/allLists.js'
import { allUsers } from '@/stores/allUsers.js'
import { statistics } from '@/stores/statistics.js'

export default {
  name: "dashboard-content",
  components: {
    TabContent,
    AsideBar,
  },

  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  beforeMount(){
    localStorage.setItem('allListAndTasks', JSON.stringify(this.lists))
    localStorage.setItem('allUsers', JSON.stringify(this.allUsers))
    localStorage.setItem('allListAndTasksStatistics', JSON.stringify(this.statistics))
  },
  computed: {
    ...mapWritableState(toggleAside, ['toggleState']),
    ...mapWritableState(allLists, ['lists', 'smartList']),
    ...mapWritableState(allUsers, ['allUsers',]),
    ...mapWritableState(statistics, ['statistics',]),
  },
  methods: {
    myEventHandler() {
      let width = document.getElementById('main-content').offsetWidth;
      if (width <= 768) {
        if (!this.toggleState) {
          this.toggleState = true
        }
      }
    }
  }
};
</script>
