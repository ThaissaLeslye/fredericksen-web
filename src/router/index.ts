import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home/HomeView.vue";
import { useAuthStore } from "../stores/auth/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: { requiresAuth: true },
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/login/LoginView.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import("../views/profile/ProfileView.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            component: () => import("../views/NotFoundView.vue"),
            meta: { requiresAuth: false },
        },
    ],
});

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();

    const isAuthenticated = await authStore.checkSession();

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: "login" });
    } else if (to.name === "login" && isAuthenticated) {
        next({ name: "home" });
    } else {
        next();
    }
});
export default router;
