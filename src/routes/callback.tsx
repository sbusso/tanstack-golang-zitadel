// src/routes/callback.tsx
import { useAuth } from '@/context/AuthProvider';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/callback')({
    component: CallbackPage,
});

function CallbackPage() {
    const { isLoading } = useAuth();

    // The auth callback is handled in the AuthProvider useEffect

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {isLoading && (
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Logging you in...</p>
                </div>
            )}
        </div>
    );
}