import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// صفحات
import Login from '@/views/Login.vue'
import UsersView from '@/views/UsersView.vue'
import CallsView from '@/views/CallsView.vue'
import GuestView from '@/views/GuestUserView.vue'
import UserDetails from '@/components/UserDetails.vue'
// import CustomersView from '@/views/CustomersView.vue'
import NotFound from '@/views/NotFound.vue' // ⬅️ صفحه 404 جدید

const routes = [
  {
    path: '/',
    redirect: '/users/view/guest', // ⬅️ هدایت از root به customers
  },
  {
    path: '/users/view/guest',
    component: GuestView,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/users',
    component: UsersView,
    name: 'Users',
    meta: { requiresAuth: true },
  },
  {
    path: '/users/create',
    name: 'UserCreate',
    component: UserDetails,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/users/:id',
    name: 'UserForm',
    component: UserDetails,
    meta: { requiresAuth: true , requiresAdmin: true},
  },
  {
    path: '/calls',
    name: 'Calls',
    component: CallsView,
    meta: { requiresAuth: true , requiresAdmin: true},
  },
  
  {
    path: '/:pathMatch(.*)*', // ⬅️ این باید همیشه آخرین مسیر باشه
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// گارد بررسی احراز هویت
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.token) {
    console.log(to)
    next('/login')
  }
  else  if (to.path === '/login' && auth.token) {
    next('/users') // هدایت به صفحه کاربران یا هر صفحه دیگری
  } 
   else  if (to.path === '/users/view/guest' && auth.token) {
    next('/users') // هدایت به صفحه کاربران یا هر صفحه دیگری
  }
  else if (to.meta.requiresAdmin && !auth.isAdmin) {
    next('/users'); // یا مسیر 403 یا هر مسیر دلخواه دیگر
  }
  else {
    next()
  }
})

export default router
