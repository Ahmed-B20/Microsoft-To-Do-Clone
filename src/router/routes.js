import List from "@/views/List.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import Login from "@/views/Login.vue";

const routes = [
  { path: "/",name:'home', redirect: '/list/0'  },
  { path: "/list",name:'homePage', redirect: '/list/0'  },
  { path: "/login",name:'login', component: Login  },
  { path: "/list/:listId(\\d+)", name:'list', component: List, props:true },
  { path: "/list/:listId(\\d+)/:childId(\\d+)", name:'child-list', component: List, props:true },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound },
];

export default routes;
