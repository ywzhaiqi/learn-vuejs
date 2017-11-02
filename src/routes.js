// import Learn from './pages/Learn.vue'
import { User, UserHome, UserPosts, UserProfile } from './pages/user'

const Learn = () => import(/* webpackChunkName: "learn-page" */ './pages/Learn.vue')
const Speech = () => import('./pages/Speech.vue')

const routes = [
  {
    path: '/learn',
    component: Learn
  },
  {
    path: '/user/:userId', name: 'user', component: User,
    children: [
      {
        path: '',
        component: UserHome,
      },
      {
        path: 'profile',
        component: UserProfile,
      },
      {
        path: 'posts',
        component: UserPosts,
      }
    ]
  },
  {
    path: '/speech', component: Speech,
  }
]

export default routes