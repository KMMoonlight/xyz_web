import {Navigate} from "react-router";
import HomePage from "@/pages/home/index"
import LoginPage from "@/pages/login/index"
import OverviewPage from "@/pages/overview"
import {RouteObject} from "react-router-dom"
import SubscriptionPage from "@/pages/subscription/index"
import UserPage from "@/pages/user/index"
import SubscriptionPodcastPage from "@/pages/subscription_podcast"
import EpisodePage from '@/pages/episode/index'

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to="/overview/home" />
    },
    {
        path: '/overview',
        element: <OverviewPage />,
        children: [
            {
                path: '/overview/home',
                element: <HomePage />
            },
            {
                path: '/overview/subscription',
                element: <SubscriptionPage/>
            },
            {
                path: '/overview/user',
                element: <UserPage/>
            },
            {
                path: '/overview/subscription/podcasts',
                element: <SubscriptionPodcastPage/>
            },
            {
                path: '/overview/episode/:episodeId',
                element: <EpisodePage />
            }
        ]
    },
    {
        path: '/login',
        element: <LoginPage />
    },
] as RouteObject[]

export default routes
