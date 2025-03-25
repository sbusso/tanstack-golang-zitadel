// src/context/AuthProvider.tsx
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

// Define types for auth context
export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: () => void;
  logout: () => void;
  getAccessToken: () => string | null;
};

// Configuration for Zitadel
const AUTH_CONFIG = {
  clientId: import.meta.env.VITE_ZITADEL_CLIENT_ID,
  domain: import.meta.env.VITE_ZITADEL_DOMAIN,
  redirectUri: `${window.location.origin}/callback`,
  audience: import.meta.env.VITE_API_AUDIENCE,
  scope: 'openid profile email',
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => { },
  logout: () => { },
  getAccessToken: () => null,
});

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const expiresAt = localStorage.getItem('expires_at');
        const currentTime = Date.now();

        if (expiresAt && Number(expiresAt) > currentTime) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        } else {
          // Token expired, clean up
          localStorage.removeItem('access_token');
          localStorage.removeItem('id_token');
          localStorage.removeItem('expires_at');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    if (window.location.pathname === '/callback') {
      handleAuthCallback();
    }
  }, []);

  // Process authentication callback
  const handleAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    // Verify state to prevent CSRF attacks
    const storedState = localStorage.getItem('auth_state');
    if (state !== storedState) {
      console.error('Invalid state parameter');
      return;
    }

    if (code) {
      try {
        setIsLoading(true);

        // Exchange code for tokens
        const tokenResponse = await fetch(`${AUTH_CONFIG.domain}/oauth/v2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: AUTH_CONFIG.clientId,
            code,
            redirect_uri: AUTH_CONFIG.redirectUri,
            code_verifier: localStorage.getItem('code_verifier') || '',
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for tokens');
        }

        const tokens = await tokenResponse.json();

        // Store tokens and expiration
        const expiresAt = Date.now() + tokens.expires_in * 1000;
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('id_token', tokens.id_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        localStorage.setItem('expires_at', expiresAt.toString());

        // Parse user info from ID token
        const userInfo = parseJwt(tokens.id_token);
        localStorage.setItem('user', JSON.stringify(userInfo));

        setUser(userInfo);
        setIsAuthenticated(true);

        // Redirect to home or original requested page
        const returnTo = localStorage.getItem('returnTo') || '/';
        localStorage.removeItem('returnTo');
        localStorage.removeItem('auth_state');
        localStorage.removeItem('code_verifier');
        window.location.href = returnTo;
      } catch (error) {
        console.error('Error handling authentication callback:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Generate a random string for state
  const generateRandomString = (length: number) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  };

  // Generate PKCE code challenge
  const generateCodeChallenge = async (codeVerifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  // Redirect to Zitadel login
  const login = async () => {
    try {
      // Store current location to redirect back after login
      const returnTo = localStorage.getItem('returnTo') || window.location.pathname;
      localStorage.setItem('returnTo', returnTo);

      // Generate PKCE code verifier and challenge
      const codeVerifier = generateRandomString(64);
      localStorage.setItem('code_verifier', codeVerifier);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Generate and store state
      const state = generateRandomString(16);
      localStorage.setItem('auth_state', state);

      // Construct authorization URL
      const authUrl = new URL(`${AUTH_CONFIG.domain}/oauth/v2/authorize`);
      authUrl.searchParams.append('client_id', AUTH_CONFIG.clientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', AUTH_CONFIG.redirectUri);
      authUrl.searchParams.append('scope', AUTH_CONFIG.scope);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('code_challenge_method', 'S256');

      // Redirect to authorization endpoint
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Error initiating login:', error);
    }
  };

  // Logout user
  const logout = () => {
    // Clear stored tokens and user info
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');

    setIsAuthenticated(false);
    setUser(null);

    // Construct logout URL
    const logoutUrl = new URL(`${AUTH_CONFIG.domain}/oauth/v2/logout`);
    logoutUrl.searchParams.append('client_id', AUTH_CONFIG.clientId);
    logoutUrl.searchParams.append('post_logout_redirect_uri', window.location.origin);

    // Redirect to logout endpoint
    window.location.href = logoutUrl.toString();
  };

  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem('access_token');
  };

  // Utility to parse JWT
  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Create hook for authenticated API requests
export function useAuthenticatedFetch() {
  const { getAccessToken } = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    const token = getAccessToken();

    const headers = {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : '',
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };
}