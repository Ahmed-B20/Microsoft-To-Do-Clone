import MyDay from "@/views/MyDay.vue";
import Important from "@/views/Important.vue";
import Planned from "@/views/Planned.vue";
import Tasks from "@/views/Tasks.vue";
import List from "@/views/List.vue";

const routes = [
  { path: "/my-day", component: MyDay },
  { path: "/important", component: Important },
  { path: "/planned", component: Planned },
  { path: "/tasks", component: Tasks },
  { path: "/list/:listId", name:'list', component: List, props:true },
  { path: "/list/:listId/:childId", name:'child-list', component: List, props:true },
];

export default routes;
