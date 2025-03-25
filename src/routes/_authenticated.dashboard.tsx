// src/routes/_authenticated.dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard')({
    component: Dashboard,
});

function Dashboard() {
    const { auth } = Route.useRouteContext();
    const { user } = auth;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Link
                    to="/profile"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    View Profile
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, {user?.name || 'User'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This is your protected dashboard. Only authenticated users can access this page.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Your recent activity would be displayed here.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Account settings and preferences would be managed here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}