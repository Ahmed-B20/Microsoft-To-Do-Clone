<template>
  <router-view v-slot="{ Component }">
    <transition name="main-content" mode="out-in">
      <div class="dashboard-content-container" :key="this.$route.params.listId">
        <component :key="this.$route.params.listId" :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

<script>
export default {
  name: 'TabContent',
  data() {
    return {

    }
  }
}
</script>