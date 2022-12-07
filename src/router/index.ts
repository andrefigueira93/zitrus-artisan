import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: { requiresAuth: false, transitionName: "slide-right" },
  },
  {
    path: "/app/inicio",
    name: "app-home",
    component: () => import("../views/app/AppHomeView.vue"),
    meta: { requiresAuth: true, transitionName: "slide-left" },
  },
  {
    path: "/app/clientes",
    name: "app-clientes",
    component: () => import("../views/app/clientes/ClientesListView.vue"),
    meta: { requiresAuth: true, transitionName: "slide-left" },
  },
  {
    path: "/app/produtos",
    name: "app-produtos",
    component: () => import("../views/app/produtos/ProdutosListView.vue"),
    meta: { requiresAuth: true, transitionName: "slide-left" },
  },
  {
    path: "/app/entregas",
    name: "app-entregas",
    component: () => import("../views/app/entregas/EntregasListView.vue"),
    meta: { requiresAuth: true, transitionName: "slide-left" },
  },
  {
    path: "*",
    redirect: "/",
    meta: { requiresAuth: false, transitionName: "slide-right" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

function setLayout(layout: string) {
  store.dispatch("layout/setLayout", layout);
}

router.beforeEach((to, from, next) => {
  const activeLayout = store.getters["layout/mode"];
  const isAuthenticated = store.getters["auth/authenticated"];
  const isProtectedRoute = to.matched.some(
    (record) => record.meta.requiresAuth
  );

  if (isProtectedRoute) {
    if (isAuthenticated) {
      if (activeLayout === "simple-layout") {
        setLayout("app-layout");
      }

      next();
    } else {
      if (activeLayout !== "simple-layout") {
        setLayout("simple-layout");
      }
      next({ name: "home" });
    }
  } else {
    if (activeLayout !== "simple-layout") {
      setLayout("simple-layout");
    }

    if (to.path === "/") {
      if (isAuthenticated) {
        next({ name: "app-home" });
      } else {
        next();
      }
    }

    next();
  }
});

router.afterEach((to, from) => {
  const toDepth = to.path.split("/").length;
  const fromDepth = from.path.split("/").length;
  if (to?.meta?.transitionName) {
    to.meta.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
  }
});

export default router;
