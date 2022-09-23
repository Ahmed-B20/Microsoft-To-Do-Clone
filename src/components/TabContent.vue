<template>
  <router-view v-slot="{ Component }">
    <transition name="main-content" mode="out-in">
      <div class="dashboard-content-container">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>