// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { auth } = Route.useRouteContext();
  const { isAuthenticated } = auth;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Welcome to our application</h2>
      <p className="mb-4">
        This is a demo application using TanStack Router with authentication via Zitadel.
      </p>
      {!isAuthenticated ? (
        <p className="text-gray-600">
          Please sign in to access protected features.
        </p>
      ) : (
        <p className="text-green-600">
          You are signed in and can access protected routes.
        </p>
      )}
    </div>
  );
}