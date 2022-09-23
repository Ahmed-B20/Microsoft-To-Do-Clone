<template>
  <div class="main-content">
    <transition>
      <AsideBar />
    </transition>

    <TabContent />
  </div>
</template>

<script>
import AsideBar from "./AsideBar.vue";
import TabContent from "./TabContent.vue";

export default {
  name: "dashboard-content",
  components: {
    TabContent,
    AsideBar,
  },
};
</script>
