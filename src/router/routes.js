import MyDay from "@/views/MyDay.vue";
import Important from "@/views/Important.vue";
import Planned from "@/views/Planned.vue";
import Tasks from "@/views/Tasks.vue";

const routes = [
  { path: "/my-day", component: MyDay },
  { path: "/important", component: Important },
  { path: "/planned", component: Planned },
  { path: "/tasks", component: Tasks },
];

export default routes;
