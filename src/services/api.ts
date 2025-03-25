// src/services/api.ts
import { useAuthenticatedFetch } from "../context/AuthProvider";

// Point to your actual Go backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export function useApi() {
  const authFetch = useAuthenticatedFetch();

  const debugToken = () => {
    const token = localStorage.getItem("access_token");
    console.log("Access token:", token);

    if (token) {
      const segments = token.split(".");
      console.log("Token segments:", segments.length);

      try {
        // Verify we can parse the payload
        if (segments.length > 1) {
          const payload = JSON.parse(atob(segments[1]));
          console.log("Token payload:", payload);
        }
      } catch (error) {
        console.error("Error parsing token payload:", error);
      }
    } else {
      console.error("No access token found in localStorage");
    }
  };

  return {
    debugToken,

    async getUserProfile() {
      // Debug the token before making the request
      debugToken();

      const response = await authFetch(`${API_BASE_URL}/user/profile`);
      if (!response.ok) {
        // Check for specific error status
        if (response.status === 401) {
          throw new Error("Unauthorized: Please login again");
        }
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }
      return response.json();
    },

    async fetchProtectedResource() {
      const response = await authFetch(`${API_BASE_URL}/protected-resource`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch protected resource: ${response.status}`
        );
      }
      return response.json();
    },
  };
}
