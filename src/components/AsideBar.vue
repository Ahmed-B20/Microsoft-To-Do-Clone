<template>
  <aside>
    <UserInfo />
    <AsideLinks />
    <AsideRenderLists />
    <AddList />
  </aside>
</template>
  
  <script>
import UserInfo from "./UserInfo.vue";
import AsideLinks from "./AsideLinks.vue";
import AsideRenderLists from "./AsideRenderLists.vue";
import AddList from "./AddList.vue";

export default {
  name: "side-bar",
  components: {
    UserInfo,
    AsideLinks,
    AsideRenderLists,
    AddList,
  },
};
</script>