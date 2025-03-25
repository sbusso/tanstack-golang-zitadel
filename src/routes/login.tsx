// src/routes/login.tsx
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { z } from 'zod';

const fallback = '/dashboard' as const

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
    }),
    beforeLoad: ({ context, search }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({ to: search.redirect || fallback })
        }
    },
    component: LoginPage,
})

function LoginPage() {
    const { auth } = Route.useRouteContext();
    const { isAuthenticated, login } = auth;
    const navigate = useNavigate();
    const search = Route.useSearch()


    // Store redirect location in localStorage for the OAuth callback to use
    useEffect(() => {
        if (search.redirect) {
            localStorage.setItem('returnTo', search.redirect);
        }
    }, [search.redirect]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const redirectTo = search.redirect || '/';
            navigate({ to: redirectTo });
        }
    }, [isAuthenticated, navigate, search.redirect]);

    const handleLogin = () => {
        login();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
                <p className="text-gray-600 text-center mb-6">
                    Please log in to access your account.
                </p>
                <Button
                    onClick={handleLogin}
                    className="w-full"
                >
                    Sign In with Zitadel
                </Button>
            </div>
        </div>
    );
}