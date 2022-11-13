import List from "@/views/List.vue";
import PageNotFound from "@/views/PageNotFound.vue";

const routes = [
  { path: "/",name:'homePage', redirect: '/list/0', props:true  },
  { path: "/list",name:'homePage', redirect: '/list/0', props:true  },
  { path: "/list/:listId(\\d+)", name:'list', component: List, props:true },
  { path: "/list/:listId(\\d+)/:childId(\\d+)", name:'child-list', component: List, props:true },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound },
];

export default routes;
