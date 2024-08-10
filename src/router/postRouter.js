import PostCreate from "@/views/post/PostCreate.vue"
import PostList from "@/views/post/PostList.vue"

export const postRouter = [
    {
        path: '/post/save',
        name: 'PostCreate',
        component: PostCreate
    },
    {
        path: '/post/list',
        name: 'PostList',
        component: PostList
    },
]