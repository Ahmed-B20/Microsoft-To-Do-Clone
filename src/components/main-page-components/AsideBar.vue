<template>
  <aside v-if="toggleState">
    <button class="toggle-aside" @click="toggleAside">
      <img src="@/assets/design-material/icons/menu.png" alt="close-sidebar">
    </button>
    <UserInfo />

    <RenderList />

    <AddList />
  </aside>
</template>
  
<script>
import UserInfo from "./UserInfo.vue";


import RenderList from '../list/RenderList.vue';
import AddList from "../list/AddList.vue";

import { toggleAside } from '@/stores/toggleAside.js'
import { mapState, mapWritableState } from 'pinia'

export default {
  name: "side-bar",
  components: {
    UserInfo,
    RenderList,
    AddList,
  },
  computed: {
    ...mapWritableState(toggleAside, ['toggleState']),
  },
  methods: {
    toggleAside() {
      this.toggleState = !this.toggleState
    }
  }
};
</script>