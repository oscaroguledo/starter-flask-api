import LiveEventPage from "../pages/PublicUserPages/LiveEventPage/LiveEventPage";
import TestingChatPage from "../pages/PublicUserPages/TestingChatPage/TestingChatPage";
import RegisterEvent from "../pages/PublicUserPages/RegisterEventPage/RegisterEventPage";

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
        route: '/register-event',
        component: RegisterEvent,
    },
    {
        route: '*',
        component: () => {
            return <>Page not found</>
        }
    },
]