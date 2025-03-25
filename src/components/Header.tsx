import { Button } from "@/components/ui/button";
import type { AuthContextType } from '@/context/AuthProvider';
import { Link } from '@tanstack/react-router';

interface HeaderProps {
  auth: AuthContextType;
}

export default function Header({ auth }: HeaderProps) {
  const { isAuthenticated, user, login, logout } = auth;

  return (
    <header className="container mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <Link to="/">Welcome to Demo App</Link>
        </h1>

        <div className="flex gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span>Welcome, {user?.name || 'User'}</span>
              <Link to="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Dashboard
              </Link>
              <Link to="/profile" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Profile
              </Link>
              <Button onClick={logout} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
