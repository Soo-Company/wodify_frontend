import PostCreate from "@/views/post/PostCreate.vue"

export const postRouter = [
    {
        path: '/post/save',
        name: 'PostCreate',
        component: PostCreate
    },
]