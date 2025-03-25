// src/routes/_authenticated.profile.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/services/apiClient";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/profile')({
    component: ProfilePage,
    loader: () => apiClient.getUserProfile(),
});

function ProfilePage() {
    const { auth } = Route.useRouteContext();
    const { user, logout } = auth;
    const navigate = useNavigate();
    const profileData = Route.useLoaderData();
    const [error, setError] = useState('');

    const handleLogout = () => {
        logout();
        navigate({ to: '/' });
    };

    if (Route.useLoaderData() === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <button
                    onClick={() => navigate({ to: '/' })}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {user?.picture && (
                            <div className="flex justify-center">
                                <img
                                    src={user.picture}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                <p className="mt-1 text-lg">{user?.name || 'N/A'}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="mt-1 text-lg">{user?.email || 'N/A'}</p>
                            </div>

                            {profileData && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                                    <p className="mt-1 text-lg">{profileData.accountType || 'Standard'}</p>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}