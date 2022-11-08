import MyDay from "@/views/MyDay.vue";
import Important from "@/views/Important.vue";
import Planned from "@/views/Planned.vue";
import Tasks from "@/views/Tasks.vue";
import List from "@/views/List.vue";
import All from "@/views/All.vue";
import Complete from "@/views/Complete.vue";

const routes = [
  { path: "/", component: MyDay },
  { path: "/my-day", name:'my-day', component: MyDay },
  { path: "/important", component: Important },
  { path: "/planned", component: Planned },
  { path: "/tasks", component: Tasks },
  { path: "/all", component: All },
  { path: "/complete", component: Complete },
  { path: "/list/:listId", name:'list', component: List, props:true },
  { path: "/list/:listId/:childId", name:'child-list', component: List, props:true },
];

export default routes;
