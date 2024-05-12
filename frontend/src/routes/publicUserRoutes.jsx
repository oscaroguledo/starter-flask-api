import LiveEventPage from "../pages/PublicUserPages/LiveEventPage/LiveEventPage";
import TestingChatPage from "../pages/PublicUserPages/TestingChatPage/TestingChatPage";

export const publicUserRoutes = [
    {
        route: '/',
        component: LiveEventPage,
    },
    {
        route: '/test-chat',
        component: TestingChatPage,
    },
    {
        route: '*',
        component: () => {
            return <>Page not found</>
        }
    },
]