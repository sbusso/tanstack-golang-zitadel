// src/routes/_authenticated.tsx
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: ({ context, location }) => {
        // Check if the user is authenticated
        if (!context.auth.isAuthenticated) {
            // Redirect to login with the current URL as a redirect parameter
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: () => <Outlet />,
});